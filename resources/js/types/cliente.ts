export type Endereco = {
    cep: string;
    logradouro: string;
    numero: number;
    complemento: string | null;
    bairro: string;
    cidade: string;
    uf: string;
};

export type Cliente = {
    id: number;
    nome: string;
    email: string;
    endereco: Endereco;
    created_at: string;
};

export type EnderecoForm = {
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
};

export type ClienteForm = {
    nome: string;
    email: string;
    endereco: EnderecoForm;
};

export type ValidationErrors = Record<string, string[]>;

export type EnderecoLookup = {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
};
