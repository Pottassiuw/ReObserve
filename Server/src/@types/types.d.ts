export interface Empresa {
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

export interface Usuario {
  id: number;
  cpf: string;
  senha: string;
  nome: string;
  email: string;
  empresaId: number;
}

export type EnterprisePayloadLogin = { cnpj: string; senha: string };
export type UserPayloadLogin = { email: string; senha: string };

export type GroupPermitions = {
  admin?: string;
  lancamento?: string;
  periodo?: string;
  verLancamentos?: string;
  editarLancamentos?: string;
  verPeriodos?: string;
  editarPeriodos?: string;
  deletarLancamentos?: string;
  deletarPeriodos?: string;
}