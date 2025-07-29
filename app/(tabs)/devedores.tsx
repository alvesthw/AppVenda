import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Devedor = {
  id: string;
  nome: string;
  trufas: { tipo: string; quantidade: number; preco: number }[];
  valorTotal: number;
  valorDevido: number;
  data: string;
};

export default function DevedoresScreen() {
  const [devedores, setDevedores] = useState<Devedor[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const carregarDevedores = async () => {
      const dados = await AsyncStorage.getItem("devedores");
      if (dados) {
        setDevedores(JSON.parse(dados));
      }
    };

    const unsubscribe = navigation.addListener("focus", carregarDevedores);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: { item: Devedor }) => (
    <View style={styles.card}>
      <Text style={styles.nome}>{item.nome}</Text>
      <Text style={styles.info}>Data: {item.data}</Text>
      {item.trufas.map((trufa, index) => (
        <Text key={index} style={styles.info}>
          {trufa.quantidade}x {trufa.tipo} - R$ {trufa.preco.toFixed(2)}
        </Text>
      ))}
      <Text style={styles.total}>Total: R$ {item.valorTotal.toFixed(2)}</Text>
      <Text style={styles.devido}>Deve: R$ {item.valorDevido.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={devedores}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum devedor registrado.</Text>}
      />
      <TouchableOpacity
        // style={styles.botao}
        // onPress={() => navigation.navigate("novoDevedor")}
      >
        <Text style={styles.botaoTexto}>+ Adicionar Devedor</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F2F2F2",
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
  },
  info: {
    fontSize: 14,
    color: "#555",
  },
  total: {
    marginTop: 8,
    fontWeight: "bold",
    color: "#2a9d8f",
  },
  devido: {
    fontWeight: "bold",
    color: "#e63946",
  },
  vazio: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
  },
  botao: {
    backgroundColor: "#007BFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
});
