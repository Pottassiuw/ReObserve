export interface User {
  id: number;
  cpf: string;
  senha: string;
  nome: string;
  email: string;
  isAdmin: boolean | null;
  empresaId: number;
}
export interface Enterprise {
  id: number;
  cnpj: string;
  senha: string;
  nomeFantasia: string;
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
