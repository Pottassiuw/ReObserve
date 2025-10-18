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
