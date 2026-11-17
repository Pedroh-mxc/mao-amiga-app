import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = '@maoamiga:favoritos';

async function gravar(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(ids));
}

export async function listarFavoritos(): Promise<string[]> {
  const bruto = await AsyncStorage.getItem(CHAVE);
  return bruto ? JSON.parse(bruto) : [];
}

export async function alternarFavorito(id: string): Promise<string[]> {
  const atuais = await listarFavoritos();
  const novos = atuais.includes(id) ? atuais.filter((x) => x !== id) : [...atuais, id];
  await gravar(novos);
  return novos;
}

export async function removerFavorito(id: string): Promise<string[]> {
  const atuais = await listarFavoritos();
  const novos = atuais.filter((x) => x !== id);
  await gravar(novos);
  return novos;
}
