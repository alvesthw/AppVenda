import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Header() {
  const dataAtual = format(new Date(), "dd 'de' MMMM", { locale: ptBR });
  const diaSemana = format(new Date(), "EEEE", { locale: ptBR });
  const [totalVendas, setTotalVendas] = useState<number | null>(null);

  useEffect(() => {
    const carregarTotalVendas = async () => {
      try {
        const hoje = new Date().toISOString().split("T")[0];
        const dadosVendas = await AsyncStorage.getItem("vendas");

        const listaVendas = dadosVendas ? JSON.parse(dadosVendas) : [];

        const vendasHoje = listaVendas.filter((v: any) => v.data === hoje);

        const total = vendasHoje.reduce(
          (soma: number, venda: any) => soma + (venda.valor ?? 0),
          0
        );

        setTotalVendas(total);
      } catch (error) {
        console.error("Erro ao carregar total de vendas:", error);
      }
    };
    carregarTotalVendas();
  }, []);

  return (
    <View>
      {/* Linha superior com perfil, nome e valor */}
      <View style={styles.header}>
        {/* Foto de perfil */}
        <View style={styles.perfilContainer}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100?img=3" }}
            style={styles.perfilImagem}
          />
        </View>

        {/* Nome e saudação */}
        <View style={styles.infoContainer}>
          <Text style={styles.title1}>Hey,</Text>
          <Text style={styles.title}>User</Text>
        </View>

        {/* Caixa azul com valor */}
        <View style={styles.valorContainer}>
          <Text style={styles.valorTexto}>
            {totalVendas !== null
              ? `R$ ${totalVendas.toFixed(2)}`
              : "Carregando..."}
          </Text>
        </View>

      </View>

      {/* Data centralizada abaixo */}
      <View style={styles.dataContainer}>
        <Text style={styles.dataTexto}>
          {diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}, {dataAtual}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  perfilContainer: {
    marginRight: 10,
  },
  perfilImagem: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  infoContainer: {
    flex: 1,
  },
  title1: {
    fontSize: 15,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
  },
  valorContainer: {
    backgroundColor: "#0D0D0D",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  valorTexto: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  dataContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  dataTexto: {
    fontSize: 12,
    fontWeight: "bold",
    color: "black",
    backgroundColor: "#F2F2F2",
    padding: 8,
    borderRadius: 4,
  },
});
