import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Trufa } from "../../utils/types";

interface Props {
  trufa: Trufa | null;
  onClose: () => void;
  onExcluir: (id: string) => void;
  onRegistrarVenda: (id: string) => void;
  onAdicionarEstoque: (id: string) => void;
  onAtualizarQuantidade: (id: string, delta: number) => void;
  onAtualizarTrufa?: () => void;
}

export default function TruffleModal({
  trufa,
  onClose,
  onExcluir,
  onRegistrarVenda,
  onAdicionarEstoque,
  onAtualizarQuantidade,
  onAtualizarTrufa
}: Props) {
  const [vendasAtuais, setVendasAtuais] = useState(0);
  const [vendasTotaisHoje, setVendasTotaisHoje] = useState(0);
  const [ativa, setAtiva] = useState(true);

  useEffect(() => {
    if (trufa) {
      setVendasAtuais(0);
      setAtiva(trufa.ativa ?? true);
      carregarVendasTotais();
    }
  }, [trufa]);

  const carregarVendasTotais = async () => {
    try {
      const hoje = new Date().toISOString().split("T")[0];
      const dados = await AsyncStorage.getItem("vendas");
      const lista = dados ? JSON.parse(dados) : [];
      const total = lista
        .filter((v: any) => v.trufaId === trufa?.id && v.data === hoje)
        .reduce((acc: number, v: any) => acc + v.quantidade, 0);
      setVendasTotaisHoje(total);
    } catch (error) {
      console.error("Erro ao carregar vendas totais:", error);
    }
  };

  const atualizarStatusTrufa = async (ativa: boolean) => {
    try {
      const dados = await AsyncStorage.getItem("trufas");
      const lista: Trufa[] = dados ? JSON.parse(dados) : [];

      const atualizadas = lista.map((t) =>
        t.id === trufa?.id ? { ...t, ativa } : t
      );

      await AsyncStorage.setItem("trufas", JSON.stringify(atualizadas));
      setAtiva(ativa);

      // ✅ Notifica o componente pai para recarregar a lista
      onAtualizarTrufa?.();
    } catch (error) {
      console.error("Erro ao atualizar status da trufa:", error);
    }
  };

  if (!trufa) return null;

  return (
    <Modal
      isVisible={!!trufa}
      onBackdropPress={onClose}
      animationIn="zoomIn"
      animationOut="zoomOut"
    >
      <View style={styles.modalContent}>
        <TouchableOpacity
          onPress={() => {
            onExcluir(trufa.id);
            onClose();
          }}
          style={styles.botaoExcluirDiscreto}
        >
          <Icon name="trash-can-outline" size={20} color="white" />
        </TouchableOpacity>

        {trufa.image && (
          <Image
            source={{ uri: trufa.image }}
            style={styles.modalImagem}
            resizeMode="cover"
          />
        )}

        <Text style={styles.trufaNome}>{trufa.nome}</Text>
        <Text style={styles.trufaDescricao}>{trufa.descricao}</Text>

        {/* ✅ Switch de ativação */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Ativa:</Text>
          <Switch
            value={ativa}
            onValueChange={(valor) => atualizarStatusTrufa(valor)}
          />
        </View>

        <Text style={styles.vendasTitulo}>
          Vendas totais hoje: {vendasTotaisHoje}
        </Text>

        <Text style={styles.vendasTitulo}>Registrar vendas agora:</Text>
        <View style={styles.contadorContainer}>
          <TouchableOpacity
            style={styles.botaoContador}
            onPress={() => setVendasAtuais(Math.max(0, vendasAtuais - 1))}
          >
            <Text style={styles.textoBotao}>-</Text>
          </TouchableOpacity>

          <Text style={styles.quantidadeTexto}>{vendasAtuais}</Text>

          <TouchableOpacity
            style={styles.botaoContador}
            onPress={() => setVendasAtuais(vendasAtuais + 1)}
          >
            <Text style={styles.textoBotao}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.botaoConfirmar}
          onPress={async () => {
            if (vendasAtuais > 0) {
              const novaVenda = {
                id: new Date().getTime().toString(),
                trufaId: trufa.id,
                quantidade: vendasAtuais,
                valor: trufa.preco * vendasAtuais,
                data: new Date().toISOString().split("T")[0],
              };

              try {
                const dados = await AsyncStorage.getItem("vendas");
                const lista = dados ? JSON.parse(dados) : [];
                lista.push(novaVenda);
                await AsyncStorage.setItem("vendas", JSON.stringify(lista));
                await carregarVendasTotais();
                onRegistrarVenda(trufa.id);
              } catch (error) {
                console.error("Erro ao registrar venda:", error);
              }

              onAtualizarQuantidade(trufa.id, vendasAtuais);
              setVendasAtuais(0);
            }
          }}
        >
          <Text style={styles.textoConfirmar}>Registrar venda</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose}>
          <Text style={styles.fecharModal}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignSelf: "center",
    position: "relative",
  },
  modalImagem: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 16,
  },
  trufaNome: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  trufaDescricao: {
    fontSize: 16,
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  contadorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  botaoContador: {
    backgroundColor: "#3B3C40",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  textoBotao: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  quantidadeTexto: {
    fontSize: 18,
    fontWeight: "bold",
  },
  fecharModal: {
    marginTop: 20,
    color: "blue",
    textAlign: "center",
  },
  botaoExcluirDiscreto: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#e63946",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  vendasTitulo: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },
  botaoConfirmar: {
    backgroundColor: "#2a9d8f",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  textoConfirmar: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
