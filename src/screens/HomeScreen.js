import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { PONTOS } from '../pontos';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.titulo}>Instituto Mão Amiga</Text>

      <TouchableOpacity style={s.botao} onPress={() => navigation.navigate('Cadastro')}>
        <Text style={s.botaoTexto}>Registrar doação</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.botao} onPress={() => navigation.navigate('Historico')}>
        <Text style={s.botaoTexto}>Minhas doações</Text>
      </TouchableOpacity>

      <Text style={s.subtitulo}>Pontos de coleta</Text>
      {PONTOS.map((p) => (
        <Text key={p} style={s.ponto}>• {p}</Text>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { padding: 16 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  subtitulo: { fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 8 },
  botao: { minHeight: 48, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2e7d32', borderRadius: 8, marginBottom: 12 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  ponto: { fontSize: 16, marginBottom: 4 },
});