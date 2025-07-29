import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Alert, StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/telaInicial/Header";
import TruffleTypeScroll from "../../components/telaInicial/TruffleTypeScroll";
import { buscarTrufas } from "../../utils/storage";
import { Trufa, Venda } from "../../utils/types";

export default function HomeScreen() {
  const [trufas, setTrufas] = useState<Trufa[]>([]);
  const [quantidadesVendidas, setQuantidadesVendidas] = useState<{
    [trufaId: string]: number;
  }>({});

  const carregarTrufas = async () => {
    try {
      const lista = await buscarTrufas();
      setTrufas(lista);
    } catch (error) {
      console.error("Erro ao carregar trufas:", error);
      setTrufas([]);
    }
  };

  const carregarVendas = async () => {
    try {
      const hoje = new Date().toISOString().split("T")[0];
      const dadosVendas = await AsyncStorage.getItem("vendas");
      const listaVendas: Venda[] = dadosVendas ? JSON.parse(dadosVendas) : [];

      const vendasHoje = listaVendas.filter((v) => v.data === hoje);

      const agrupadas = vendasHoje.reduce(
        (acc: { [trufaId: string]: number }, venda) => {
          acc[venda.trufaId] = (acc[venda.trufaId] || 0) + venda.quantidade;
          return acc;
        },
        {}
      );

      setQuantidadesVendidas(agrupadas);
    } catch (error) {
      console.error("Erro ao carregar vendas:", error);
    }
  };

  const salvarTrufas = async (novasTrufas: Trufa[]) => {
    try {
      await AsyncStorage.setItem("trufas", JSON.stringify(novasTrufas));
      setTrufas(novasTrufas);
    } catch (error) {
      console.error("Erro ao salvar trufas:", error);
    }
  };

  const excluirTrufa = (id: string) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta trufa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const novaLista = trufas.filter((trufa) => trufa.id !== id);
              await salvarTrufas(novaLista);
            } catch (error) {
              console.error("Erro ao excluir trufa:", error);
            }
          },
        },
      ]
    );
  };

  const adicionarEstoque = async (id: string) => {
    const atualizadas = trufas.map((t) =>
      t.id === id
        ? { ...t, quantidadeEstoque: (t.quantidadeEstoque || 0) + 1 }
        : t
    );
    await salvarTrufas(atualizadas);
  };

  const atualizarQuantidadeVendida = async (id: string, delta: number) => {
    const atualizadas = trufas.map((t) =>
      t.id === id
        ? {
            ...t,
            quantidadeVendida: Math.max((t.quantidadeVendida || 0) + delta, 0),
          }
        : t
    );
    await salvarTrufas(atualizadas);
  };

  useFocusEffect(
    useCallback(() => {
      carregarTrufas();
      carregarVendas(); // ✅ carrega as vendas do dia
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header />
      <TruffleTypeScroll
        trufas={trufas}
        onExcluir={excluirTrufa}
        onRegistrarVenda={() => {}}
        onAdicionarEstoque={adicionarEstoque}
        onAtualizarQuantidade={atualizarQuantidadeVendida}
        quantidadesVendidas={quantidadesVendidas}
        onAtualizarTrufa={carregarTrufas} // ✅ Adiciona aqui
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
});
