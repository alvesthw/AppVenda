import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Venda } from "../../utils/types";

export default function Relatorio() {
  const [vendasHoje, setVendasHoje] = useState<Venda[]>([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const carregarVendas = async () => {
        setCarregando(true);
        try {
          const hoje = new Date().toISOString().split("T")[0];

          const dadosVendas = await AsyncStorage.getItem("vendas");
          const dadosTrufas = await AsyncStorage.getItem("trufas");

          const listaVendas: Venda[] = dadosVendas
            ? JSON.parse(dadosVendas)
            : [];
          const trufas = dadosTrufas ? JSON.parse(dadosTrufas) : [];

          const trufaIdsAtuais = trufas.map((t: any) => t.id);

          const filtradas = listaVendas.filter(
            (v) => v.data === hoje && trufaIdsAtuais.includes(v.trufaId)
          );

          setVendasHoje(filtradas);
        } catch (error) {
          console.error("Erro ao carregar vendas:", error);
        } finally {
          setCarregando(false);
        }
      };

      carregarVendas();
    }, [])
  );

  const totalVendas = vendasHoje.reduce(
    (total, item) => total + (item.valor ?? 0),
    0
  );

  if (carregando) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#2a9d8f" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Relatório Diário de Vendas</Text>

      <FlatList
        data={vendasHoje}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.produto}>{item.trufaId}</Text>
            <Text style={styles.detalhes}>
              Quantidade: {item.quantidade} | Valor:{" "}
              {item.valor != null ? `R$ ${item.valor.toFixed(2)}` : "N/A"}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.semVendas}>Nenhuma venda registrada hoje.</Text>
        }
        ListFooterComponent={
          vendasHoje.length > 0 ? (
            <Text style={styles.total}>
              Total do dia: R$ {totalVendas.toFixed(2)}
            </Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  produto: {
    fontSize: 18,
    fontWeight: "600",
  },
  detalhes: {
    fontSize: 14,
    color: "#555",
  },
  total: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2a9d8f",
  },
  semVendas: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
    color: "#999",
  },
});
