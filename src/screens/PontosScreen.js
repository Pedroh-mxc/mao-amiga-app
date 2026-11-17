import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { buscarPagina } from '../services/pontosService';
import { listarFavoritos, alternarFavorito } from '../services/favoritosStorage';
import { usePaginacao } from '../hooks/usePaginacao';

const ItemPonto = React.memo(function ItemPonto({ item, favorito, onAbrir, onFavoritar }) {
  return (
    <View style={s.item}>
      <TouchableOpacity style={s.itemTexto} onPress={() => onAbrir(item.id)}>
        <Text style={s.nome}>{item.nome}</Text>
        <Text>{item.endereco} - {item.bairro}</Text>
        <Text>{item.horario}</Text>
        <Text style={s.tipo}>{item.tipo}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={s.coracao}
        onPress={() => onFavoritar(item.id)}
        accessibilityLabel={favorito ? 'Desmarcar favorito' : 'Marcar como favorito'}
      >
        <Text style={s.coracaoTexto}>{favorito ? '♥' : '♡'}</Text>
      </TouchableOpacity>
    </View>
  );
});

export default function PontosScreen({ navigation }) {
  const { itens, carregando, carregandoMais, erro, erroMais, recarregar, carregarMais } = usePaginacao(buscarPagina);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('');
  const [favoritos, setFavoritos] = useState([]);

  // espera o usuário parar de digitar antes de buscar na API
  useEffect(() => {
    const t = setTimeout(() => setFiltro(busca.trim()), 400);
    return () => clearTimeout(t);
  }, [busca]);

  // a cada busca (ou ao voltar para a tela) recomeça da primeira página
  useFocusEffect(
    useCallback(() => {
      recarregar(filtro);
      listarFavoritos().then(setFavoritos);
    }, [recarregar, filtro])
  );

  const abrir = useCallback((id) => navigation.navigate('DetalhePonto', { id }), [navigation]);
  const favoritar = useCallback(async (id) => setFavoritos(await alternarFavorito(id)), []);

  let conteudo;
  if (carregando) {
    conteudo = (
      <View style={s.centro}>
        <ActivityIndicator size="large" />
        <Text style={s.msg}>Carregando pontos...</Text>
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
  } else {
    conteudo = (
      <FlatList
        data={itens}
        extraData={favoritos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemPonto item={item} favorito={favoritos.includes(item.id)} onAbrir={abrir} onFavoritar={favoritar} />
        )}
        onEndReached={carregarMais}
        onEndReachedThreshold={0.4}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={s.msg}>{filtro ? `Nenhum ponto encontrado para "${filtro}".` : 'Nenhum ponto cadastrado.'}</Text>
        }
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
      <TextInput
        style={s.busca}
        placeholder="Buscar por nome ou bairro"
        value={busca}
        onChangeText={setBusca}
      />
      <TouchableOpacity style={s.novo} onPress={() => navigation.navigate('FormPonto')}>
        <Text style={s.novoTexto}>+ Novo ponto</Text>
      </TouchableOpacity>
      {conteudo}
    </View>
  );
}

const s = StyleSheet.create({
  busca: { borderWidth: 1, borderRadius: 8, margin: 8, padding: 10, minHeight: 44 },
  novo: { minHeight: 44, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2e7d32', borderRadius: 8, marginHorizontal: 8, marginBottom: 8 },
  novoTexto: { color: '#fff', fontWeight: 'bold' },
  item: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 8, marginBottom: 8, borderWidth: 1, borderRadius: 8 },
  itemTexto: { flex: 1, padding: 12, minHeight: 44 },
  nome: { fontWeight: 'bold', fontSize: 16 },
  tipo: { marginTop: 4, fontStyle: 'italic' },
  coracao: { minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center', marginRight: 4 },
  coracaoTexto: { fontSize: 26, color: '#c62828' },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  msg: { textAlign: 'center', marginTop: 20 },
  erro: { color: '#c62828', textAlign: 'center', marginBottom: 12 },
  botao: { minHeight: 44, minWidth: 44, padding: 12, borderWidth: 1, borderRadius: 8, justifyContent: 'center', margin: 8 },
});
