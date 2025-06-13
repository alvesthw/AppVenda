import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function CriarTrufa() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const router = useRouter();

  const salvarTrufa = async () => {
    if (!nome.trim() || !descricao.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const novaTrufa = {
      id: Date.now().toString(),
      nome,
      descricao,
    };

    try {
      const trufasSalvas = await AsyncStorage.getItem('trufas');
      const trufas = trufasSalvas ? JSON.parse(trufasSalvas) : [];
      trufas.push(novaTrufa);
      await AsyncStorage.setItem('trufas', JSON.stringify(trufas));

      Alert.alert('Sucesso', 'Trufa salva com sucesso!');
      setNome('');
      setDescricao('');

      // Voltar para a tela anterior
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a trufa.');
      console.error('Erro ao salvar trufa:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Nova Trufa</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da trufa"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />

      <TouchableOpacity style={styles.button} onPress={salvarTrufa}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#6200ea',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
