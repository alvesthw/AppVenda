import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Alert, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/telaInicial/Header";
import SearchBar from "../../components/telaInicial/SearchBar";
import TruffleTypeScroll from "../../components/telaInicial/TruffleTypeScroll";
import { buscarTrufas } from "../../utils/storage";
import { Trufa } from "../../utils/types";

export default function HomeScreen() {
  const [trufas, setTrufas] = useState<Trufa[]>([]);

  const carregarTrufas = async () => {
    try {
      const lista = await buscarTrufas();
      setTrufas(lista);
    } catch (error) {
      console.error("Erro ao carregar trufas:", error);
      setTrufas([]);
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
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header />
      <SearchBar />
      <View style={styles.itens}>
        <TruffleTypeScroll
          trufas={trufas}
          onExcluir={excluirTrufa}
          onRegistrarVenda={() => {}}
          onAdicionarEstoque={adicionarEstoque}
          onAtualizarQuantidade={atualizarQuantidadeVendida}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  itens: {
    paddingTop: 20,
  },
});
