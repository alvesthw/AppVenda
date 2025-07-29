import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function CriarTrufa() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permissão negada",
        "Você precisa permitir o acesso à galeria."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const salvarTrufa = async () => {
    if (!nome.trim() || !descricao.trim() || !image?.trim() || !preco?.trim()) {
      Alert.alert("Erro", "Preencha todos os campos e selecione uma imagem.");
      return;
    }

    const precoFloat = parseFloat(preco.replace(",", "."));

    if (isNaN(precoFloat)) {
      Alert.alert("Erro", "Preço inválido.");
      return;
    }

    try {
      const fileName = image.split("/").pop();
      const newPath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.copyAsync({ from: image, to: newPath });

      const novaTrufa = {
        id: Date.now().toString(),
        nome,
        descricao,
        preco: precoFloat,
        image: newPath,
      };

      const trufasSalvas = await AsyncStorage.getItem("trufas");
      const trufas = trufasSalvas ? JSON.parse(trufasSalvas) : [];
      trufas.push(novaTrufa);
      await AsyncStorage.setItem("trufas", JSON.stringify(trufas));

      Alert.alert("Sucesso", "Trufa salva com sucesso!");
      setNome("");
      setDescricao("");
      setPreco("");
      setImage(null);
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a trufa.");
      console.error("Erro ao salvar trufa:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Criar Nova Trufa</Text>

          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Selecionar Imagem</Text>
          </TouchableOpacity>

          <View style={styles.imageFrame}>
            {image && <Image source={{ uri: image }} style={styles.image} />}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Nome da trufa"
            placeholderTextColor="#D7D7D9"
            value={nome}
            onChangeText={setNome}
          />

          <TextInput
            style={styles.input}
            placeholder="Descrição"
            placeholderTextColor="#D7D7D9"
            value={descricao}
            onChangeText={setDescricao}
          />

          <TextInput
            style={styles.input}
            placeholder="Preço"
            placeholderTextColor="#D7D7D9"
            keyboardType="numeric"
            value={preco}
            onChangeText={(text) => {
              // Remove tudo que não for número ou vírgula
              const cleaned = text.replace(/[^0-9,]/g, "");

              // Formata automaticamente para duas casas decimais
              const numeric = cleaned.replace(",", ".");
              setPreco(numeric);
            }}
          />

          <TouchableOpacity style={styles.button} onPress={salvarTrufa}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#6200ea",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  imageFrame: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});
