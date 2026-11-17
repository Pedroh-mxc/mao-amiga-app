import { get, post, put, del } from './api';
import type { Ponto, PontoForm, Pagina } from '../types';

export function listar(): Promise<Ponto[]> {
  return get('/pontos');
}

export function buscarPagina(filtro: string, page: number, size: number = 10): Promise<Pagina<Ponto>> {
  return get(`/pontos/filtro?filtro=${encodeURIComponent(filtro)}&page=${page}&size=${size}`);
}

export function buscarPorId(id: string): Promise<Ponto> {
  return get(`/pontos/${id}`);
}

export function cadastrar(ponto: PontoForm): Promise<Ponto> {
  return post('/pontos', ponto);
}

export function editar(id: string, ponto: PontoForm): Promise<Ponto> {
  return put(`/pontos/${id}`, ponto);
}

export function excluir(id: string): Promise<void> {
  return del(`/pontos/${id}`);
}
