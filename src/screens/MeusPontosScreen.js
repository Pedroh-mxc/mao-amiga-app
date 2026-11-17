import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { buscarPorId } from '../services/pontosService';
import { listarFavoritos, removerFavorito } from '../services/favoritosStorage';
import { mensagemDeErro } from '../services/api';

export default function MeusPontosScreen({ navigation }) {
  const [pontos, setPontos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      const ids = await listarFavoritos();
      const resultados = await Promise.all(
        ids.map(async (id) => {
          try {
            return await buscarPorId(id);
          } catch (e) {
            if (e.status === 404) return null; // ponto excluído: fica de fora
            throw e;
          }
        })
      );
      setPontos(resultados.filter(Boolean));
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function desmarcar(id) {
    setPontos((atuais) => atuais.filter((p) => p.id !== id)); // some na hora
    await removerFavorito(id);
  }

  if (carregando) {
    return (
      <View style={s.centro}>
        <ActivityIndicator size="large" />
        <Text style={s.msg}>Carregando seus pontos...</Text>
      </View>
    );
  }
  if (erro) {
    return (
      <View style={s.centro}>
        <Text style={s.erro}>{erro}</Text>
        <TouchableOpacity style={s.botao} onPress={carregar}>
          <Text>Tentar de novo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={pontos}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingTop: 8 }}
      ListEmptyComponent={
        <Text style={s.msg}>Você ainda não favoritou nenhum ponto. Toque no ♡ na lista de pontos.</Text>
      }
      renderItem={({ item }) => (
        <View style={s.item}>
          <TouchableOpacity style={s.itemTexto} onPress={() => navigation.navigate('DetalhePonto', { id: item.id })}>
            <Text style={s.nome}>{item.nome}</Text>
            <Text>{item.endereco} - {item.bairro}</Text>
            <Text>{item.horario}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.desmarcar} onPress={() => desmarcar(item.id)}>
            <Text style={s.desmarcarTexto}>♥</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const s = StyleSheet.create({
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  item: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 8, marginBottom: 8, borderWidth: 1, borderRadius: 8 },
  itemTexto: { flex: 1, padding: 12, minHeight: 44 },
  nome: { fontWeight: 'bold', fontSize: 16 },
  desmarcar: { minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center', marginRight: 4 },
  desmarcarTexto: { fontSize: 26, color: '#c62828' },
  msg: { textAlign: 'center', marginTop: 20, paddingHorizontal: 16 },
  erro: { color: '#c62828', textAlign: 'center', marginBottom: 12 },
  botao: { minHeight: 44, minWidth: 44, padding: 12, borderWidth: 1, borderRadius: 8, justifyContent: 'center' },
});
