export interface User {
  id: number;
  cpf: string;
  senha: string;
  nome: string;
  email: string;
  dataCriacao: Date;
  admin: boolean;
  empresaId: number;
  grupoId: number | null;
  grupo?: Grupo;
  lancamento?: Lancamento[];
}

export interface Grupo {
  id: number;
  nome: string;
  permissoes: string[];
  empresaId: number;
}

export interface Enterprise {
  id: number;
  cnpj: string;
  senha: string;
  nomeFantasia: string | null;
  razaoSocial: string;
  endereco: string;
  situacaoCadastral: string;
  naturezaJuridica: string;
  CNAES: string;
  dataCriacao: string;
}

export interface Imagem {
  id: number;
  url: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
  lancamentoId: number;
}

export interface NotaFiscal {
  id: number;
  numero: string;
  valor: number | null;
  xmlPath: string | null;
  dataEmissao: Date;
  dataCriacao: Date;
  empresaId: number;
}

export interface Lancamento {
  id: number;
  data_lancamento: string | Date;
  latitude: number;
  longitude: number;
  dataCriacao: Date;
  dataAtualizacao: Date;
  periodoId: number | null;
  notaFiscalId: number;
  usuarioId: number;
  empresaId: number;

  // Relações incluídas
  imagens: Imagem[];
  notaFiscal: NotaFiscal;
}

export interface CriarLancamentoDTO {
  numeroNotaFiscal: string;
  valor: number;
  dataEmissao: Date;
  xmlPath?: string;

  latitude: number;
  longitude: number;
  data_lancamento: Date;

  imagensUrls: string[];

  usuarioId: number;
  empresaId: number;
  periodoId?: number;
}
