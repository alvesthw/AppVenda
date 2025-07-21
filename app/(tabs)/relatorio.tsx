import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Venda } from "../../utils/types";

import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import XLSX from "xlsx";

type VendaAgrupada = {
  trufaId: string;
  nomeTrufa: string;
  quantidade: number;
  valor: number;
};

export default function Relatorio() {
  const [vendasAgrupadas, setVendasAgrupadas] = useState<VendaAgrupada[]>([]);
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

          const trufaMap = trufas.reduce((acc: any, trufa: any) => {
            acc[trufa.id] = trufa.nome;
            return acc;
          }, {});

          const vendasHoje = listaVendas.filter(
            (v) => v.data === hoje && trufaMap[v.trufaId]
          );

          const agrupadas: { [key: string]: VendaAgrupada } = {};

          vendasHoje.forEach((venda) => {
            if (!agrupadas[venda.trufaId]) {
              agrupadas[venda.trufaId] = {
                trufaId: venda.trufaId,
                nomeTrufa: trufaMap[venda.trufaId],
                quantidade: 0,
                valor: 0,
              };
            }
            agrupadas[venda.trufaId].quantidade += venda.quantidade;
            agrupadas[venda.trufaId].valor += venda.valor ?? 0;
          });

          setVendasAgrupadas(Object.values(agrupadas));
        } catch (error) {
          console.error("Erro ao carregar vendas:", error);
        } finally {
          setCarregando(false);
        }
      };

      carregarVendas();
    }, [])
  );

  const totalVendas = vendasAgrupadas.reduce(
    (total, item) => total + item.valor,
    0
  );

  const exportarRelatorioParaExcel = async () => {
    try {
      const dados = vendasAgrupadas.map((item) => ({
        Trufa: item.nomeTrufa,
        Quantidade: item.quantidade,
        Valor: item.valor.toFixed(2),
      }));

      const ws = XLSX.utils.json_to_sheet(dados);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Relatório");

      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

      const caminho =
        FileSystem.documentDirectory +
        `relatorio_vendas_${new Date().toISOString().split("T")[0]}.xlsx`;

      await FileSystem.writeAsStringAsync(caminho, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert(
          "Erro",
          "Compartilhamento não disponível neste dispositivo."
        );
        return;
      }

      await Sharing.shareAsync(caminho, {
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: "Compartilhar relatório",
        UTI: "com.microsoft.excel.xlsx",
      });
    } catch (error) {
      console.error("Erro ao exportar relatório:", error);
      Alert.alert("Erro", "Não foi possível exportar o relatório.");
    }
  };

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
      <Button
        title="Exportar para Excel"
        onPress={exportarRelatorioParaExcel}
        color="#2a9d8f"
      />

      <FlatList
        data={vendasAgrupadas}
        keyExtractor={(item) => item.trufaId}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.produto}>{item.nomeTrufa}</Text>
            <Text style={styles.detalhes}>
              Quantidade: {item.quantidade} | Valor: R$ {item.valor.toFixed(2)}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.semVendas}>Nenhuma venda registrada hoje.</Text>
        }
        ListFooterComponent={
          vendasAgrupadas.length > 0 ? (
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
