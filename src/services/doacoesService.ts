import { get, post, put, del } from './api';
import type { Doacao, DoacaoForm, Pagina } from '../types';

export function listarPagina(filtro: string, page: number, size: number = 10): Promise<Pagina<Doacao>> {
  return get(`/doacoes/filtro?filtro=${encodeURIComponent(filtro)}&page=${page}&size=${size}`);
}

export function buscarPorId(id: string): Promise<Doacao> {
  return get(`/doacoes/${id}`);
}

export function cadastrar(doacao: DoacaoForm): Promise<Doacao> {
  return post('/doacoes', doacao);
}

export function editar(id: string, doacao: DoacaoForm): Promise<Doacao> {
  return put(`/doacoes/${id}`, doacao);
}

export function excluir(id: string): Promise<void> {
  return del(`/doacoes/${id}`);
}
