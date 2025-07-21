import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Header() {
  const dataAtual = format(new Date(), "dd 'de' MMMM", { locale: ptBR });
  const diaSemana = format(new Date(), "EEEE", { locale: ptBR });

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
          <Text style={styles.title}>Vinicius</Text>
        </View>

        {/* Caixa azul com valor */}
        <View style={styles.valorContainer}>
          <Text style={styles.valorTexto}>R$ 400,00</Text>
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
    backgroundColor: "#007BFF",
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
