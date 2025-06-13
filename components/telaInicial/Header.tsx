import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Header() {
  const dataAtual = format(new Date(), "dd 'de' MMMM", { locale: ptBR });
  const diaSemana = format(new Date(), 'EEEE', { locale: ptBR });

  return (
    <View style={styles.header}>
      <View style={styles.dataContainer}>
        <Text style={styles.dataTexto}>
          {diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}, {dataAtual}
        </Text>
        <Text style={styles.title}>Wallcome, Vini!</Text>
      </View>
      <View style={styles.perfilBolinha} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: '#D9D9D9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 0,
  },
  dataContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingTop: 5,
  },
  dataTexto: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A6A6A6',
  },
  perfilBolinha: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'black',
  },
});
