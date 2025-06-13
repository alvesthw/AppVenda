import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trufa } from './types'; // ajuste o caminho conforme necessário

const STORAGE_KEY = 'trufas';

export async function salvarTrufas(trufas: Trufa[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trufas));
  } catch (error) {
    console.error('Erro ao salvar trufas:', error);
  }
}

export async function buscarTrufas(): Promise<Trufa[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao buscar trufas:', error);
    return [];
  }
}

export async function adicionarTrufa(novaTrufa: Trufa) {
  const trufas = await buscarTrufas();
  const atualizadas = [...trufas, novaTrufa];
  await salvarTrufas(atualizadas);
}
