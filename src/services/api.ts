// Troque pelo IP do computador que roda a API (comando ipconfig, campo IPv4).
// No celular NÃO use localhost: ele apontaria para o próprio celular.
export const API_URL = 'http://192.168.0.10:8080/api/v1';

const TEMPO_LIMITE_MS = 8000;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function requisicao(metodo: string, caminho: string, corpo?: unknown): Promise<any> {
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);
  let resposta: Response;

  try {
    resposta = await fetch(API_URL + caminho, {
      method: metodo,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
      signal: controle.signal,
    });
  } catch (e) {
    throw new ApiError(0, 'Não foi possível conectar à API. Confira se ela está ligada e se o IP está certo.');
  } finally {
    clearTimeout(timer);
  }

  if (!resposta.ok) {
    let mensagem = `A API respondeu com erro ${resposta.status}.`;
    try {
      const dados = await resposta.json();
      if (dados && dados.message) {
        mensagem = dados.message;
      }
    } catch (e) {
      // resposta sem corpo JSON: mantém a mensagem padrão
    }
    throw new ApiError(resposta.status, mensagem);
  }

  if (resposta.status === 204) {
    return null;
  }
  return resposta.json();
}

export const get = (caminho: string): Promise<any> => requisicao('GET', caminho);
export const post = (caminho: string, corpo: unknown): Promise<any> => requisicao('POST', caminho, corpo);
export const put = (caminho: string, corpo: unknown): Promise<any> => requisicao('PUT', caminho, corpo);
export const del = (caminho: string): Promise<any> => requisicao('DELETE', caminho);

export function mensagemDeErro(e: any): string {
  if (e && typeof e.status === 'number') {
    return e.message;
  }
  return 'Algo deu errado. Tente novamente.';
}
