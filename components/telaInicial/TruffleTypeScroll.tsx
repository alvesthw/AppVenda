import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
          {trufa.image && (
            <Image
              source={{ uri: trufa.image }}
              style={styles.trufaImagem}
            />
          )}
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
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  trufaImagem: {
    width: 80,
    height: 80,
    borderRadius: 10,
    margin: 5,
  },
  trufaItem: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    minHeight: 90,
    alignItems: 'center',
    position: 'relative',
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
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  addButtonContainer: {
    backgroundColor: '#92A4A6',
    height: 70,
    borderRadius: 25,
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
