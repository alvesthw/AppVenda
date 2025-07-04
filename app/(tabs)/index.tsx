import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/telaInicial/Header';
import SearchBar from '../../components/telaInicial/SearchBar';
import TruffleTypeScroll from '../../components/telaInicial/TruffleTypeScroll';
import { buscarTrufas } from '../../utils/storage';
import { Trufa } from '../../utils/types'; // ajuste o caminho conforme necessário

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
    backgroundColor: '#0D0D0D',
  },
  itens: {
    paddingTop: 20,
  }
});
