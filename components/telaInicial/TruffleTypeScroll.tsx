import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Trufa } from '../../utils/types';

interface Props {
  trufas: Trufa[];
  onExcluir: (id: string) => void;
}

export default function TruffleTypeScroll({ trufas, onExcluir }: Props) {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>

      {trufas.map((trufa) => (
        <View key={trufa.id} style={styles.trufaItem}>
          <View style={styles.trufaInfo}>
            <Text style={styles.trufaNome}>{trufa.nome}</Text>
          </View>
          <TouchableOpacity onPress={() => onExcluir(trufa.id)} style={styles.excluirArea}>
            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>×</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity onPress={() => router.push('/telas/criarTrufa')}>
        <View style={styles.addButtonContainer}>
          <Text style={styles.addButtonText}>+ Nova Trufa</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    backgroundColor: '#F2F2F2',
    height: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginHorizontal: 16,
  },
  trufaItem: {
    flexDirection: 'row',
    backgroundColor: '#8C8C8C',
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    height: 90,
    overflow: 'hidden',
    position: 'relative', // necessário para posicionar a bolinha
  },
  trufaInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  trufaNome: {
    fontSize: 18,
    color: '#2d3436',
    fontWeight: 'bold',
  },
  excluirArea: {
    position: 'absolute',
    top: 8,
    right: 8, // <-- aqui está a mudança
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  addButtonContainer: {
    backgroundColor: '#D9D9D9',
    height: 90,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
