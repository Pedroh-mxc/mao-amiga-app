import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = '@maoamiga:doacoes';

export async function listarDoacoes() {
  const raw = await AsyncStorage.getItem(CHAVE);
  return raw ? JSON.parse(raw) : [];
}

async function gravar(lista) {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(lista));
}

export async function salvarDoacao(doacao) {
  const lista = await listarDoacoes();
  const nova = {
    ...doacao,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    criadoEm: new Date().toISOString(),
  };
  await gravar([...lista, nova]);
  return nova;
}

export async function excluirDoacao(id) {
  const lista = await listarDoacoes();
  await gravar(lista.filter((d) => d.id !== id));
}

export async function atualizarDoacao(doacao) {
  const lista = await listarDoacoes();
  await gravar(lista.map((d) => (d.id === doacao.id ? { ...d, ...doacao } : d)));
}