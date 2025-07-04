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
import Modal from "react-native-modal";
import { Trufa } from "../../utils/types";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  trufas: Trufa[];
  onExcluir: (id: string) => void;
}

export default function TruffleTypeScroll({ trufas, onExcluir }: Props) {
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

      <Modal
        isVisible={!!trufaSelecionada}
        animationIn="zoomIn"
        animationOut="zoomOut"
        onBackdropPress={() => setTrufaSelecionada(null)}
      >
        <View style={styles.modalContent}>
          {trufaSelecionada?.image && (
            <Image
              source={{ uri: trufaSelecionada.image }}
              style={styles.modalImagem}
              resizeMode="cover"
            />
          )}
          <Text style={styles.trufaNome}>{trufaSelecionada?.nome}</Text>
          <Text style={styles.trufaDescricao}>
            {trufaSelecionada?.descricao}
          </Text>

          {/* Botão de excluir dentro do modal */}
          <TouchableOpacity
            onPress={() => {
              if (trufaSelecionada) {
                onExcluir(trufaSelecionada.id);
                setTrufaSelecionada(null); // fecha o modal após excluir
              }
            }}
            style={styles.botaoExcluirModal}
          >
            <Text style={styles.textoExcluirModal}>Excluir Trufa</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setTrufaSelecionada(null)}>
            <Text style={styles.fecharModal}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    backgroundColor: "#3B3C40",
    borderRadius: 10,
    height: "100%",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  trufaItem: {
    position: "relative",
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
    fontWeight: "normal",
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
  botaoExcluirModal: {
    marginTop: 20,
    backgroundColor: "#e63946",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  textoExcluirModal: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  excluirArea: {
    backgroundColor: "#3B3C40",
    borderRadius: 18,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  excluirTexto: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignSelf: "center",
  },
  fecharModal: {
    marginTop: 20,
    color: "blue",
    textAlign: "center",
  },
  modalImagem: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 16,
  },
});
