export interface Pessoa {
  id: number
  nome: string
  cpf: string
  dataCriacao: string
}

export interface Categoria {
  id: number
  nome: string
  dataCriacao: string
}

export interface Transacao {
  id: number
  descricao: string
  valor: number
  tipo: 'Receita' | 'Despesa'
  data: string
  pessoaId: number
  pessoaNome?: string
  categoriaId: number
  categoriaNome?: string
  dataCriacao: string
}

export interface TotalPorPessoa {
  pessoaId: number
  pessoaNome: string
  totalReceitas: number
  totalDespesas: number
  saldo: number
}

export interface TotalPorCategoria {
  categoriaId: number
  categoriaNome: string
  totalReceitas: number
  totalDespesas: number
  total: number
}
