export type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  horario: string;
  tipo: 'coleta' | 'distribuição';
};

export type PontoForm = Omit<Ponto, 'id'>;

export type Doacao = {
  id: string;
  tipoItem: string;
  quantidade: number;
  pontoDestino: string;
  criadoEm: string;
};

export type DoacaoForm = Omit<Doacao, 'id' | 'criadoEm'>;

export type Pagina<T> = {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};
