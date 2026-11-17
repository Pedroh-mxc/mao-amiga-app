import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { buscarPorId, excluir } from '../services/pontosService';
import { mensagemDeErro } from '../services/api';

export default function DetalhePontoScreen({ route, navigation }) {
  const { id } = route.params; // a navegação leva só o id
  const [ponto, setPonto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    setErro(null);
    setNaoEncontrado(false);
    try {
      setPonto(await buscarPorId(id));
    } catch (e) {
      setPonto(null);
      if (e.status === 404) setNaoEncontrado(true);
      else setErro(mensagemDeErro(e));
    } finally {
      setCarregando(false);
    }
  }, [id]);

  // busca de novo ao voltar da edição, para mostrar os valores novos
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  function confirmarExclusao() {
    Alert.alert('Excluir ponto', `Excluir "${ponto.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluir(id);
            navigation.goBack();
          } catch (e) {
            Alert.alert('Não foi possível excluir', mensagemDeErro(e));
          }
        },
      },
    ]);
  }

  if (carregando) {
    return (
      <View style={s.centro}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (naoEncontrado) {
    return (
      <View style={s.centro}>
        <Text style={s.titulo}>ponto não encontrado</Text>
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
    <View style={{ padding: 16 }}>
      <Text style={s.titulo}>{ponto.nome}</Text>
      <Text style={s.linha}>Tipo: {ponto.tipo}</Text>
      <Text style={s.linha}>Endereço: {ponto.endereco}</Text>
      <Text style={s.linha}>Bairro: {ponto.bairro}</Text>
      <Text style={s.linha}>Funcionamento: {ponto.horario}</Text>

      <TouchableOpacity style={s.botao} onPress={() => navigation.navigate('FormPonto', { ponto })}>
        <Text>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.botao} onPress={confirmarExclusao}>
        <Text>Excluir</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  linha: { fontSize: 16, marginBottom: 8 },
  erro: { color: '#c62828', textAlign: 'center', marginBottom: 12 },
  botao: { minHeight: 48, minWidth: 44, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 8, marginTop: 12 },
});
