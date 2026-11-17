import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { buscarPorId, excluir } from '../services/doacoesService';
import { mensagemDeErro } from '../services/api';

export default function DetalheDoacaoScreen({ route, navigation }) {
  const { id } = route.params; // a navegação leva só o id
  const [doacao, setDoacao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [naoEncontrada, setNaoEncontrada] = useState(false);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    setErro(null);
    setNaoEncontrada(false);
    try {
      setDoacao(await buscarPorId(id));
    } catch (e) {
      setDoacao(null);
      if (e.status === 404) setNaoEncontrada(true);
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
    Alert.alert('Excluir doação', 'Tem certeza que deseja excluir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluir(id);
            navigation.goBack(); // volta ao histórico, que recarrega a lista
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
  if (naoEncontrada) {
    return (
      <View style={s.centro}>
        <Text style={s.titulo}>doação não encontrada</Text>
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
      <Text style={s.linha}>Tipo: {doacao.tipoItem}</Text>
      <Text style={s.linha}>Quantidade: {doacao.quantidade}</Text>
      <Text style={s.linha}>Ponto de destino: {doacao.pontoDestino}</Text>
      <Text style={s.linha}>Registrada em: {new Date(doacao.criadoEm).toLocaleString('pt-BR')}</Text>

      <TouchableOpacity style={s.botao} onPress={() => navigation.navigate('Cadastro', { doacao })}>
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
  titulo: { fontSize: 18, fontWeight: 'bold' },
  linha: { fontSize: 16, marginBottom: 8 },
  erro: { color: '#c62828', textAlign: 'center', marginBottom: 12 },
  botao: { minHeight: 48, minWidth: 44, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 8, marginTop: 12 },
});
