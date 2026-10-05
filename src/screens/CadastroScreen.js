import React, { useState, useLayoutEffect } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
         KeyboardAvoidingView, Platform, View } from 'react-native';
import { PONTOS } from '../pontos';
import { salvarDoacao, atualizarDoacao } from '../doacoesStorage';

export default function CadastroScreen({ route, navigation }) {
  const doacaoEdicao = route.params?.doacao; // undefined = cadastro novo

  const [tipoItem, setTipoItem] = useState(doacaoEdicao?.tipoItem ?? '');
  const [quantidade, setQuantidade] = useState(doacaoEdicao ? String(doacaoEdicao.quantidade) : '');
  const [pontoDestino, setPontoDestino] = useState(doacaoEdicao?.pontoDestino ?? '');
  const [erros, setErros] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({ title: doacaoEdicao ? 'Editar doação' : 'Registrar doação' });
  }, [navigation, doacaoEdicao]);

  function validar() {
    const e = {};
    if (tipoItem.trim().length < 2) e.tipoItem = 'Informe o tipo do item (mínimo 2 letras).';
    const q = Number(quantidade);
    if (!Number.isInteger(q) || q <= 0) e.quantidade = 'Informe uma quantidade inteira maior que zero.';
    if (!pontoDestino) e.pontoDestino = 'Escolha um ponto de destino.';
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function salvar() {
    if (!validar()) return;
    const dados = { tipoItem: tipoItem.trim(), quantidade: Number(quantidade), pontoDestino };
    if (doacaoEdicao) {
      await atualizarDoacao({ ...doacaoEdicao, ...dados });
      navigation.pop(2); // fecha edição e detalhe, volta ao histórico
    } else {
      await salvarDoacao(dados);
      navigation.replace('Historico');
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
        <Text style={s.label}>Tipo do item</Text>
        <TextInput style={s.input} value={tipoItem} onChangeText={setTipoItem} placeholder="Ex.: Roupa" />
        {erros.tipoItem && <Text style={s.erro}>{erros.tipoItem}</Text>}

        <Text style={s.label}>Quantidade</Text>
        <TextInput style={s.input} value={quantidade} onChangeText={setQuantidade}
                   keyboardType="numeric" placeholder="Ex.: 5" />
        {erros.quantidade && <Text style={s.erro}>{erros.quantidade}</Text>}

        <Text style={s.label}>Ponto de destino</Text>
        <View>
          {PONTOS.map((p) => (
            <TouchableOpacity key={p} style={[s.opcao, pontoDestino === p && s.opcaoAtiva]}
                              onPress={() => setPontoDestino(p)}>
              <Text style={pontoDestino === p && { color: '#fff' }}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {erros.pontoDestino && <Text style={s.erro}>{erros.pontoDestino}</Text>}

        <TouchableOpacity style={s.botao} onPress={salvar}>
          <Text style={s.botaoTexto}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.botaoSec} onPress={() => navigation.goBack()}>
          <Text>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: 'bold', marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, minHeight: 44 },
  erro: { color: '#c62828', marginTop: 4 },
  opcao: { minHeight: 44, justifyContent: 'center', padding: 10, borderWidth: 1, borderRadius: 8, marginBottom: 8 },
  opcaoAtiva: { backgroundColor: '#2e7d32' },
  botao: { minHeight: 48, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2e7d32', borderRadius: 8, marginTop: 20 },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  botaoSec: { minHeight: 48, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 8, marginTop: 12 },
});