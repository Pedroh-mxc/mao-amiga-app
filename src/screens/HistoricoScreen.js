import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet,
         KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { listarDoacoes } from '../doacoesStorage';

const ItemDoacao = React.memo(function ItemDoacao({ item, onPress }) {
  return (
    <TouchableOpacity style={s.item} onPress={() => onPress(item)}>
      <Text style={s.titulo}>{item.tipoItem} ({item.quantidade})</Text>
      <Text>Destino: {item.pontoDestino}</Text>
      <Text>{new Date(item.criadoEm).toLocaleString('pt-BR')}</Text>
    </TouchableOpacity>
  );
});

export default function HistoricoScreen({ navigation }) {
  const [doacoes, setDoacoes] = useState([]);
  const [carregado, setCarregado] = useState(false);
  const [busca, setBusca] = useState('');

  // recarrega sempre que a tela ganha foco (aparece sem fechar o app)
  useFocusEffect(
    useCallback(() => {
      listarDoacoes().then((lista) => {
        setDoacoes(lista);
        setCarregado(true);
      });
    }, [])
  );

  // #12: lista filtrada calculada a partir do estado, sem segunda cópia
  const filtradas = doacoes.filter((d) =>
    d.tipoItem.toLowerCase().includes(busca.trim().toLowerCase())
  );

  // #13: totais calculados a cada renderização, do maior para o menor
  const resumo = useMemo(() => {
    const mapa = {};
    doacoes.forEach((d) => {
      mapa[d.tipoItem] = mapa[d.tipoItem] || { tipo: d.tipoItem, qtd: 0, n: 0 };
      mapa[d.tipoItem].qtd += Number(d.quantidade);
      mapa[d.tipoItem].n += 1;
    });
    return Object.values(mapa).sort((a, b) => b.qtd - a.qtd);
  }, [doacoes]);

  const abrirDetalhe = useCallback(
    (doacao) => navigation.navigate('DetalheDoacao', { doacao }),
    [navigation]
  );

  if (!carregado) return null;

  if (doacoes.length === 0) {
    return (
      <View style={s.vazio}>
        <Text style={s.titulo}>Nenhuma doação registrada ainda.</Text>
        <Text>Total: 0 doações</Text>
        <TouchableOpacity style={s.botao} onPress={() => navigation.replace('Cadastro')}>
          <Text>Registrar doação</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.resumo}>
        <Text style={s.titulo}>Total: {doacoes.length} doações</Text>
        {resumo.map((r) => (
          <Text key={r.tipo}>{r.tipo}: {r.qtd} unidades em {r.n} doações</Text>
        ))}
      </View>

      <TextInput style={s.busca} placeholder="Filtrar por tipo de item" value={busca} onChangeText={setBusca} />

      <FlatList
        data={filtradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemDoacao item={item} onPress={abrirDetalhe} />}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<Text style={s.msg}>Nenhuma doação encontrada para "{busca}".</Text>}
      />
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  item: { padding: 12, marginHorizontal: 8, marginBottom: 8, borderWidth: 1, borderRadius: 8, minHeight: 44 },
  titulo: { fontWeight: 'bold', fontSize: 16 },
  vazio: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  botao: { marginTop: 12, minHeight: 44, minWidth: 44, padding: 12, borderWidth: 1, borderRadius: 8, justifyContent: 'center' },
  busca: { borderWidth: 1, borderRadius: 8, margin: 8, padding: 10, minHeight: 44 },
  resumo: { padding: 12 },
  msg: { textAlign: 'center', marginTop: 20 },
});