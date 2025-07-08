import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trufa, Venda } from './types';

const TRUFAS_KEY = 'trufas';
const VENDAS_KEY = 'vendas';

//
// TRUFAS
//

export async function salvarTrufas(trufas: Trufa[]) {
  try {
    await AsyncStorage.setItem(TRUFAS_KEY, JSON.stringify(trufas));
  } catch (error) {
    console.error('Erro ao salvar trufas:', error);
  }
}

export async function buscarTrufas(): Promise<Trufa[]> {
  try {
    const data = await AsyncStorage.getItem(TRUFAS_KEY);
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

export async function removerTrufa(id: string) {
  const trufas = await buscarTrufas();
  const atualizadas = trufas.filter(t => t.id !== id);
  await salvarTrufas(atualizadas);
}

export async function editarTrufa(trufaEditada: Trufa) {
  const trufas = await buscarTrufas();
  const atualizadas = trufas.map(t => (t.id === trufaEditada.id ? trufaEditada : t));
  await salvarTrufas(atualizadas);
}

//
// VENDAS
//

export async function salvarVendas(vendas: Venda[]) {
  try {
    await AsyncStorage.setItem(VENDAS_KEY, JSON.stringify(vendas));
  } catch (error) {
    console.error('Erro ao salvar vendas:', error);
  }
}

export async function buscarVendas(): Promise<Venda[]> {
  try {
    const data = await AsyncStorage.getItem(VENDAS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    return [];
  }
}

export async function adicionarVenda(novaVenda: Venda) {
  const vendas = await buscarVendas();
  const atualizadas = [...vendas, novaVenda];
  await salvarVendas(atualizadas);
}
