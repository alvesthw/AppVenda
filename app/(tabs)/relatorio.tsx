import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const vendas = [
  { id: '1', produto: 'Camiseta', quantidade: 3, valor: 90 },
  { id: '2', produto: 'Tênis', quantidade: 1, valor: 250 },
  { id: '3', produto: 'Boné', quantidade: 2, valor: 60 },
];

export default function Relatorio() {
  const totalVendas = vendas.reduce((total, item) => total + item.valor, 0);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Relatório Diário de Vendas</Text>

      <FlatList
        data={vendas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.produto}>{item.produto}</Text>
            <Text style={styles.detalhes}>
              Quantidade: {item.quantidade} | Valor: R$ {item.valor.toFixed(2)}
            </Text>
          </View>
        )}
        ListFooterComponent={
          <Text style={styles.total}>Total do dia: R$ {totalVendas.toFixed(2)}</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  produto: {
    fontSize: 18,
    fontWeight: '600',
  },
  detalhes: {
    fontSize: 14,
    color: '#555',
  },
  total: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2a9d8f',
  },
});
