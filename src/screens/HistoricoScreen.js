import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { listarPagina } from '../services/doacoesService';
import { usePaginacao } from '../hooks/usePaginacao';

const ItemDoacao = React.memo(function ItemDoacao({ item, onPress }) {
  return (
    <TouchableOpacity style={s.item} onPress={() => onPress(item.id)}>
      <Text style={s.titulo}>{item.tipoItem} ({item.quantidade})</Text>
      <Text>Destino: {item.pontoDestino}</Text>
      <Text>{new Date(item.criadoEm).toLocaleString('pt-BR')}</Text>
    </TouchableOpacity>
  );
});

export default function HistoricoScreen({ navigation }) {
  const { itens, carregando, carregandoMais, erro, erroMais, recarregar, carregarMais } = usePaginacao(listarPagina);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setFiltro(busca.trim()), 400);
    return () => clearTimeout(t);
  }, [busca]);

  // ao voltar para a tela (ou mudar o filtro) recomeça da primeira página: a doação nova aparece no topo
  useFocusEffect(
    useCallback(() => {
      recarregar(filtro);
    }, [recarregar, filtro])
  );

  const abrir = useCallback((id) => navigation.navigate('DetalheDoacao', { id }), [navigation]);

  let conteudo;
  if (carregando) {
    conteudo = (
      <View style={s.centro}>
        <ActivityIndicator size="large" />
        <Text style={s.msg}>Carregando doações...</Text>
      </View>
    );
  } else if (erro) {
    conteudo = (
      <View style={s.centro}>
        <Text style={s.erro}>{erro}</Text>
        <TouchableOpacity style={s.botao} onPress={() => recarregar(filtro)}>
          <Text>Tentar de novo</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (itens.length === 0 && !filtro) {
    conteudo = (
      <View style={s.centro}>
        <Text style={s.titulo}>Nenhuma doação registrada ainda.</Text>
        <TouchableOpacity style={s.botao} onPress={() => navigation.replace('Cadastro')}>
          <Text>Registrar doação</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    conteudo = (
      <FlatList
        data={itens}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemDoacao item={item} onPress={abrir} />}
        onEndReached={carregarMais}
        onEndReachedThreshold={0.4}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<Text style={s.msg}>Nenhuma doação encontrada para "{filtro}".</Text>}
        ListFooterComponent={
          carregandoMais ? (
            <ActivityIndicator style={{ margin: 16 }} />
          ) : erroMais ? (
            <TouchableOpacity style={s.botao} onPress={carregarMais}>
              <Text>{erroMais} Toque para tentar de novo.</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TextInput style={s.busca} placeholder="Filtrar por tipo de item" value={busca} onChangeText={setBusca} />
      {conteudo}
    </View>
  );
}

const s = StyleSheet.create({
  busca: { borderWidth: 1, borderRadius: 8, margin: 8, padding: 10, minHeight: 44 },
  item: { padding: 12, marginHorizontal: 8, marginBottom: 8, borderWidth: 1, borderRadius: 8, minHeight: 44 },
  titulo: { fontWeight: 'bold', fontSize: 16 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  msg: { textAlign: 'center', marginTop: 20 },
  erro: { color: '#c62828', textAlign: 'center', marginBottom: 12 },
  botao: { minHeight: 44, minWidth: 44, padding: 12, borderWidth: 1, borderRadius: 8, justifyContent: 'center', margin: 8 },
});
