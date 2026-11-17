import React, { useState, useLayoutEffect } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import { cadastrar, editar } from '../services/pontosService';
import { mensagemDeErro } from '../services/api';

const TIPOS = ['coleta', 'distribuição'];

export default function FormPontoScreen({ route, navigation }) {
  const pontoEdicao = route.params?.ponto; // vazio = cadastro novo

  const [nome, setNome] = useState(pontoEdicao?.nome ?? '');
  const [endereco, setEndereco] = useState(pontoEdicao?.endereco ?? '');
  const [bairro, setBairro] = useState(pontoEdicao?.bairro ?? '');
  const [horario, setHorario] = useState(pontoEdicao?.horario ?? '');
  const [tipo, setTipo] = useState(pontoEdicao?.tipo ?? '');
  const [erros, setErros] = useState({});
  const [erroApi, setErroApi] = useState(null);
  const [enviando, setEnviando] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: pontoEdicao ? 'Editar ponto' : 'Novo ponto' });
  }, [navigation, pontoEdicao]);

  function validar() {
    const e = {};
    if (!nome.trim()) e.nome = 'Informe o nome.';
    if (!endereco.trim()) e.endereco = 'Informe o endereço.';
    if (!bairro.trim()) e.bairro = 'Informe o bairro.';
    if (!horario.trim()) e.horario = 'Informe o horário de funcionamento.';
    if (!tipo) e.tipo = 'Escolha o tipo do ponto.';
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function salvar() {
    if (!validar()) return;
    setEnviando(true);
    setErroApi(null);
    const dados = {
      nome: nome.trim(),
      endereco: endereco.trim(),
      bairro: bairro.trim(),
      horario: horario.trim(),
      tipo,
    };
    try {
      if (pontoEdicao) await editar(pontoEdicao.id, dados);
      else await cadastrar(dados);
      navigation.goBack();
    } catch (e) {
      // mantém o que foi digitado e avisa, sem fingir que deu certo
      setErroApi(mensagemDeErro(e));
      setEnviando(false);
    }
  }

  const campo = (rotulo, valor, setValor, chave, placeholder) => (
    <>
      <Text style={s.label}>{rotulo}</Text>
      <TextInput style={s.input} value={valor} onChangeText={setValor} placeholder={placeholder} />
      {erros[chave] && <Text style={s.erro}>{erros[chave]}</Text>}
    </>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
        {campo('Nome', nome, setNome, 'nome', 'Ex.: Ponto Leste')}
        {campo('Endereço', endereco, setEndereco, 'endereco', 'Ex.: Rua 9, 120')}
        {campo('Bairro', bairro, setBairro, 'bairro', 'Ex.: Setor Bueno')}
        {campo('Horário de funcionamento', horario, setHorario, 'horario', 'Ex.: Seg a Sex, 8h às 17h')}

        <Text style={s.label}>Tipo</Text>
        <View style={s.linha}>
          {TIPOS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[s.opcao, tipo === t && s.opcaoAtiva]}
              onPress={() => setTipo(t)}
            >
              <Text style={tipo === t && { color: '#fff' }}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {erros.tipo && <Text style={s.erro}>{erros.tipo}</Text>}

        {erroApi && <Text style={s.erroApi}>{erroApi}</Text>}

        <TouchableOpacity style={[s.botao, enviando && { opacity: 0.6 }]} onPress={salvar} disabled={enviando}>
          <Text style={s.botaoTexto}>{pontoEdicao ? 'Salvar alterações' : 'Cadastrar ponto'}</Text>
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
  linha: { flexDirection: 'row', gap: 12 },
  opcao: { flex: 1, minHeight: 44, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 8 },
  opcaoAtiva: { backgroundColor: '#2e7d32' },
  botao: { minHeight: 48, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2e7d32', borderRadius: 8, marginTop: 20 },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  botaoSec: { minHeight: 48, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 8, marginTop: 12 },
});
