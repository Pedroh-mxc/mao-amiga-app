import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, View, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { listar as listarPontos } from '../services/pontosService';
import { cadastrar, editar } from '../services/doacoesService';
import { mensagemDeErro } from '../services/api';

export default function CadastroScreen({ route, navigation }) {
  const doacaoEdicao = route.params?.doacao; // vazio = cadastro novo

  const [tipoItem, setTipoItem] = useState(doacaoEdicao?.tipoItem ?? '');
  const [quantidade, setQuantidade] = useState(doacaoEdicao ? String(doacaoEdicao.quantidade) : '');
  const [pontoDestino, setPontoDestino] = useState(doacaoEdicao?.pontoDestino ?? '');
  const [erros, setErros] = useState({});
  const [erroApi, setErroApi] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const [pontos, setPontos] = useState([]);
  const [carregandoPontos, setCarregandoPontos] = useState(true);
  const [erroPontos, setErroPontos] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: doacaoEdicao ? 'Editar doação' : 'Registrar doação' });
  }, [navigation, doacaoEdicao]);

  const carregarPontos = useCallback(async () => {
    setCarregandoPontos(true);
    setErroPontos(null);
    try {
      setPontos(await listarPontos());
    } catch (e) {
      setErroPontos(mensagemDeErro(e));
    } finally {
      setCarregandoPontos(false);
    }
  }, []);

  useEffect(() => {
    carregarPontos();
  }, [carregarPontos]);

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
    setEnviando(true);
    setErroApi(null);
    const dados = { tipoItem: tipoItem.trim(), quantidade: Number(quantidade), pontoDestino };
    try {
      if (doacaoEdicao) {
        await editar(doacaoEdicao.id, dados);
        navigation.goBack(); // volta ao detalhe, que busca os valores novos
      } else {
        await cadastrar(dados);
        navigation.replace('Historico');
      }
    } catch (e) {
      // mantém o que foi digitado e avisa, sem fingir que deu certo
      setErroApi(mensagemDeErro(e));
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
        <Text style={s.label}>Tipo do item</Text>
        <TextInput style={s.input} value={tipoItem} onChangeText={setTipoItem} placeholder="Ex.: Roupa" />
        {erros.tipoItem && <Text style={s.erro}>{erros.tipoItem}</Text>}

        <Text style={s.label}>Quantidade</Text>
        <TextInput style={s.input} value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" placeholder="Ex.: 5" />
        {erros.quantidade && <Text style={s.erro}>{erros.quantidade}</Text>}

        <Text style={s.label}>Ponto de destino</Text>
        {pontoDestino ? <Text style={s.selecionado}>Selecionado: {pontoDestino}</Text> : null}
        {carregandoPontos && (
          <View style={s.linhaCentro}>
            <ActivityIndicator />
            <Text style={s.msg}>Carregando pontos...</Text>
          </View>
        )}
        {erroPontos && (
          <View>
            <Text style={s.erro}>{erroPontos}</Text>
            <TouchableOpacity style={s.botaoSec} onPress={carregarPontos}>
              <Text>Tentar carregar os pontos de novo</Text>
            </TouchableOpacity>
          </View>
        )}
        {pontos.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[s.opcao, pontoDestino === p.nome && s.opcaoAtiva]}
            onPress={() => setPontoDestino(p.nome)}
          >
            <Text style={[{ fontWeight: 'bold' }, pontoDestino === p.nome && { color: '#fff' }]}>{p.nome}</Text>
            <Text style={pontoDestino === p.nome && { color: '#fff' }}>{p.bairro}</Text>
          </TouchableOpacity>
        ))}
        {erros.pontoDestino && <Text style={s.erro}>{erros.pontoDestino}</Text>}

        {erroApi && <Text style={s.erroApi}>{erroApi}</Text>}

        <TouchableOpacity style={[s.botao, enviando && { opacity: 0.6 }]} onPress={salvar} disabled={enviando}>
          <Text style={s.botaoTexto}>{doacaoEdicao ? 'Salvar alterações' : 'Registrar doação'}</Text>
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
  erroApi: { color: '#c62828', marginTop: 16, fontWeight: 'bold' },
  selecionado: { marginBottom: 8, fontStyle: 'italic' },
  linhaCentro: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  msg: { marginLeft: 8 },
  opcao: { minHeight: 44, justifyContent: 'center', padding: 10, borderWidth: 1, borderRadius: 8, marginBottom: 8 },
  opcaoAtiva: { backgroundColor: '#2e7d32' },
  botao: { minHeight: 48, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2e7d32', borderRadius: 8, marginTop: 20 },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  botaoSec: { minHeight: 48, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 8, marginTop: 12 },
});
