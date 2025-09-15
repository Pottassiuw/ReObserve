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
    id:number;
    cpf: string;
    senha: string;
    nome: string;
    email: string;
    empresaId: number;
}
