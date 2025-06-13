import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../../components/telaInicial/Header';
import SearchBar from '../../components/telaInicial/SearchBar';
import TruffleTypeScroll from '../../components/telaInicial/TruffleTypeScroll';
import { buscarTrufas } from '../../utils/storage';
import { Trufa } from '../../utils/types'; // ajuste o caminho conforme necessário
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';





export default function HomeScreen() {
  const [trufas, setTrufas] = useState<Trufa[]>([]);
  const excluirTrufa = (id: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta trufa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const listaAtual = await buscarTrufas();
              const novaLista = listaAtual.filter((trufa) => trufa.id !== id);
              await AsyncStorage.setItem('trufas', JSON.stringify(novaLista));
              setTrufas(novaLista);
            } catch (error) {
              console.error('Erro ao excluir trufa:', error);
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      async function carregarTrufas() {
        try {
          const lista = await buscarTrufas();
          setTrufas(lista);
        } catch (error) {
          console.error('Erro ao carregar trufas:', error);
          setTrufas([]);
        }
      }

      carregarTrufas();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header />
      <SearchBar />
      <View style={styles.itens}>
        <TruffleTypeScroll trufas={trufas} onExcluir={excluirTrufa} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },
  itens: {
    paddingTop: 20,
  }
});
