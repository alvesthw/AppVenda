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
import TruffleModal from "./TruffleModal";

// Habilita animações no Android
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
  onAtualizarQuantidade: (id: string, delta: number) => void;
  quantidadesVendidas?: { [trufaId: string]: number };
  onAtualizarTrufa?: () => void;
}

export default function TruffleTypeScroll({
  trufas,
  onExcluir,
  onRegistrarVenda,
  onAdicionarEstoque,
  onAtualizarQuantidade,
  quantidadesVendidas = {},
  onAtualizarTrufa,
}: Props) {
  const router = useRouter();
  const [trufaSelecionada, setTrufaSelecionada] = useState<Trufa | null>(null);

  return (
    <View style={styles.container}>
      {/* Botão "Nova Trufa" */}
      <TouchableOpacity onPress={() => router.push("/telas/criarTrufa")}>
        <View style={styles.addButtonContainer}>
          <Text style={styles.addButtonText}>+</Text>
        </View>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.gridContainer}>
          {trufas.map((trufa) => (
            <TouchableOpacity
              key={trufa.id}
              style={[
                styles.trufaItem,
                !trufa.ativa && styles.trufaItemInativo,
              ]}
              onPress={() => setTrufaSelecionada(trufa)}
              activeOpacity={0.9}
            >
              <View style={styles.trufaContent}>
                {/* Imagem à esquerda */}
                {trufa.image && (
                  <Image
                    source={{ uri: trufa.image }}
                    style={styles.trufaImagem}
                  />
                )}

                {/* Informações à direita */}
                <View style={styles.trufaInfo}>
                  <Text style={styles.trufaNome}>{trufa.nome}</Text>
                  <Text style={styles.trufaDescricao}>R$ {trufa.preco}</Text>
                  <Text style={styles.trufaQuantidade}>
                    Vendidas: {quantidadesVendidas[trufa.id] ?? 0}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Modal de detalhes */}
        <TruffleModal
          trufa={trufaSelecionada}
          onClose={() => setTrufaSelecionada(null)}
          onExcluir={onExcluir}
          onRegistrarVenda={onRegistrarVenda}
          onAdicionarEstoque={onAdicionarEstoque}
          onAtualizarQuantidade={onAtualizarQuantidade}
          onAtualizarTrufa={onAtualizarTrufa}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  scrollContainer: {
    borderRadius: 10,
    minHeight: "100%",
  },
  gridContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  trufaItem: {
    width: "100%",
    backgroundColor: "white",
    marginBottom: 10,
    borderRadius: 20,
    padding: 10,
  },
  trufaItemInativo: {
    opacity: 0.2,
  },

  trufaContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  trufaImagem: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },

  trufaInfo: {
    flex: 1,
    flexDirection: "column",
  },
  trufaNome: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  trufaDescricao: {
    fontSize: 16,
    color: "black",
  },
  trufaQuantidade: {
    fontSize: 14,
    color: "#2a9d8f",
    marginTop: 4,
  },

  addButtonContainer: {
    marginBottom: 16,
    alignItems: "center",
    backgroundColor: "#0D0D0D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  addButtonText: {
    fontSize: 16,
    color: "white",
  },
});
