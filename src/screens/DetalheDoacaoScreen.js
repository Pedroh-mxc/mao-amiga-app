import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { excluirDoacao } from '../doacoesStorage';

export default function DetalheDoacaoScreen({ route, navigation }) {
  const { doacao } = route.params;

  function confirmarExclusao() {
    Alert.alert('Excluir doação', 'Tem certeza que deseja excluir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await excluirDoacao(doacao.id);
          navigation.goBack();
        },
      },
    ]);
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={s.linha}>Tipo: {doacao.tipoItem}</Text>
      <Text style={s.linha}>Quantidade: {doacao.quantidade}</Text>
      <Text style={s.linha}>Ponto de destino: {doacao.pontoDestino}</Text>
      <Text style={s.linha}>Registrada em: {new Date(doacao.criadoEm).toLocaleString('pt-BR')}</Text>

      <TouchableOpacity style={s.btn} onPress={() => navigation.navigate('Cadastro', { doacao })}>
        <Text>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.btn} onPress={confirmarExclusao}>
        <Text>Excluir</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  linha: { fontSize: 16, marginBottom: 8 },
  btn: { minHeight: 48, minWidth: 44, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 8, marginTop: 12 },
});