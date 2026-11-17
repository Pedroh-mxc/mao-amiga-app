import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.titulo}>Instituto Mão Amiga</Text>

      <Text style={s.secao}>Pontos de coleta</Text>
      <TouchableOpacity style={s.botao} onPress={() => navigation.navigate('Pontos')}>
        <Text style={s.botaoTexto}>Ver pontos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.botao} onPress={() => navigation.navigate('MeusPontos')}>
        <Text style={s.botaoTexto}>Meus pontos</Text>
      </TouchableOpacity>

      <Text style={s.secao}>Doações</Text>
      <TouchableOpacity style={s.botao} onPress={() => navigation.navigate('Cadastro')}>
        <Text style={s.botaoTexto}>Registrar doação</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.botao} onPress={() => navigation.navigate('Historico')}>
        <Text style={s.botaoTexto}>Minhas doações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { padding: 16 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  secao: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 8 },
  botao: { minHeight: 48, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2e7d32', borderRadius: 8, marginBottom: 12 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
