import { useState, useCallback, useRef } from 'react';
import { mensagemDeErro } from '../services/api';
import type { Pagina } from '../types';

// Controla rolagem infinita: carrega a página 0 (recarregar) e as seguintes (carregarMais),
// sem pedir a mesma página duas vezes e parando na última.
export function usePaginacao<T>(buscar: (filtro: string, page: number) => Promise<Pagina<T>>) {
  const [itens, setItens] = useState<T[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [erroMais, setErroMais] = useState<string | null>(null);

  const proximaPagina = useRef(0);
  const ocupado = useRef(false);
  const ultimaPagina = useRef(false);
  const filtroAtual = useRef('');
  const versao = useRef(0); // descarta respostas de buscas antigas

  const recarregar = useCallback(
    async (filtro: string) => {
      const minhaVersao = ++versao.current;
      filtroAtual.current = filtro;
      proximaPagina.current = 0;
      ultimaPagina.current = false;
      ocupado.current = true;
      setCarregando(true);
      setErro(null);
      setErroMais(null);
      try {
        const resposta = await buscar(filtro, 0);
        if (minhaVersao !== versao.current) return;
        setItens(resposta.content);
        proximaPagina.current = 1;
        ultimaPagina.current = resposta.page.number + 1 >= resposta.page.totalPages;
      } catch (e) {
        if (minhaVersao !== versao.current) return;
        setItens([]);
        setErro(mensagemDeErro(e));
      } finally {
        if (minhaVersao === versao.current) {
          ocupado.current = false;
          setCarregando(false);
        }
      }
    },
    [buscar]
  );

  const carregarMais = useCallback(async () => {
    if (ocupado.current || ultimaPagina.current || proximaPagina.current === 0) return;
    const minhaVersao = versao.current;
    const pagina = proximaPagina.current;
    ocupado.current = true;
    setCarregandoMais(true);
    setErroMais(null);
    try {
      const resposta = await buscar(filtroAtual.current, pagina);
      if (minhaVersao !== versao.current) return;
      setItens((atuais) => [...atuais, ...resposta.content]);
      proximaPagina.current = pagina + 1;
      ultimaPagina.current = resposta.page.number + 1 >= resposta.page.totalPages;
    } catch (e) {
      if (minhaVersao !== versao.current) return;
      setErroMais(mensagemDeErro(e));
    } finally {
      if (minhaVersao === versao.current) {
        ocupado.current = false;
        setCarregandoMais(false);
      }
    }
  }, [buscar]);

  return { itens, carregando, carregandoMais, erro, erroMais, recarregar, carregarMais };
}
