
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { Trufa } from "../../utils/types";
import TruffleModal from "./TruffleModal"; // ajuste o caminho se necessário

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  trufas: Trufa[];
  onExcluir: (id: string) => void;
  onRegistrarVenda: (id: string) => void;
  onAdicionarEstoque: (id: string) => void;
  onAtualizarQuantidade: (id: string, delta: number) => void; // ✅ Adicione esta linha
}

export default function TruffleTypeScroll({
  trufas,
  onExcluir,
  onRegistrarVenda,
  onAdicionarEstoque,
  onAtualizarQuantidade,
}: Props) {
  const router = useRouter();
  const [trufaSelecionada, setTrufaSelecionada] = useState<Trufa | null>(null);
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>

      <View style={styles.gridContainer}>
        {trufas.map((trufa) => (
          <TouchableOpacity
            key={trufa.id}
            style={styles.trufaItem}
            onPress={() => setTrufaSelecionada(trufa)}
            activeOpacity={0.9}
          >
            {trufa.image && (
              <Image source={{ uri: trufa.image }} style={styles.trufaImagem} />
            )}
            <View style={styles.trufaInfo}>
              <Text style={styles.trufaNome}>{trufa.nome}</Text>
              <Text style={styles.trufaDescricao}>R$ {trufa.preco}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={() => router.push("/telas/criarTrufa")}>
        <View style={styles.addButtonContainer}>
          <Text style={styles.addButtonText}>+ Nova Trufa</Text>
        </View>
      </TouchableOpacity>

      <TruffleModal
        trufa={trufaSelecionada}
        onClose={() => setTrufaSelecionada(null)}
        onExcluir={onExcluir}
        onRegistrarVenda={onRegistrarVenda} // ✅ Aqui está certo agora
        onAdicionarEstoque={onAdicionarEstoque}
        onAtualizarQuantidade={onAtualizarQuantidade}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    borderRadius: 10,
    height: "100%",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  trufaItem: {
    width: "48%",
    backgroundColor: "white",
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
  },
  trufaImagem: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  trufaInfo: {
    flexDirection: "column",
    marginTop: 8,
  },
  trufaNome: {
    fontSize: 16,
    fontWeight: "bold",
  },
  trufaDescricao: {
    fontSize: 16,
  },
  addButtonContainer: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "#BDBEBF",
    padding: 20,
    borderRadius: 10,
  },
  addButtonText: {
    fontSize: 16,
    color: "white",
  },
});
