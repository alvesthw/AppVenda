import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function SearchBar() {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.inputText}
        placeholder="Procure alguma coisa"
        placeholderTextColor="#999"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  inputText: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});
