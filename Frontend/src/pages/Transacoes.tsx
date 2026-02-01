import { useState, useEffect } from 'react'
import api from '../services/api'
import { Transacao, Pessoa, Categoria } from '../types'

export default function Transacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])

  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [tipo, setTipo] = useState<'Receita' | 'Despesa'>('Despesa')
  const [data, setData] = useState('')
  const [pessoaId, setPessoaId] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [editando, setEditando] = useState<number | null>(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const [transRes, pesRes, catRes] = await Promise.all([
        api.get('/transacoes'),
        api.get('/pessoas'),
        api.get('/categorias')
      ])
      setTransacoes(transRes.data)
      setPessoas(pesRes.data)
      setCategorias(catRes.data)
    } catch (error) {
      setErro('Erro ao carregar dados')
    }
  }

  const extrairMensagemErro = (error: any): string => {
    const data = error.response?.data
    if (data?.mensagem) return data.mensagem
    if (data?.errors && typeof data.errors === 'object') {
      const mensagens = Object.values(data.errors).flat()
      return Array.isArray(mensagens) ? mensagens.join(' ') : String(mensagens)
    }
    return data?.title || 'Erro ao salvar. Verifique se todos os campos foram preenchidos.'
  }

  const salvar = async () => {
    try {
      setErro('')

      const valorNum = parseFloat(valor)
      const pessoaIdNum = parseInt(pessoaId, 10)
      const categoriaIdNum = parseInt(categoriaId, 10)

      if (!descricao.trim()) {
        setErro('Informe a descrição.')
        return
      }
      if (isNaN(valorNum) || valorNum <= 0) {
        setErro('Informe um valor válido (maior que zero).')
        return
      }
      if (!data) {
        setErro('Informe a data.')
        return
      }
      if (!pessoaId || isNaN(pessoaIdNum)) {
        setErro('Selecione uma pessoa.')
        return
      }
      if (!categoriaId || isNaN(categoriaIdNum)) {
        setErro('Selecione uma categoria.')
        return
      }

      const dados = {
        descricao: descricao.trim(),
        valor: valorNum,
        tipo,
        data,
        pessoaId: pessoaIdNum,
        categoriaId: categoriaIdNum
      }

      if (editando) {
        await api.put(`/transacoes/${editando}`, { ...dados, id: editando })
      } else {
        await api.post('/transacoes', dados)
      }
      limpar()
      carregarDados()
    } catch (error: any) {
      setErro(extrairMensagemErro(error))
    }
  }

  const editar = (transacao: Transacao) => {
    setDescricao(transacao.descricao)
    setValor(transacao.valor.toString())
    setTipo(transacao.tipo)
    setData(transacao.data.split('T')[0])
    setPessoaId(transacao.pessoaId.toString())
    setCategoriaId(transacao.categoriaId.toString())
    setEditando(transacao.id)
  }

  const excluir = async (id: number) => {
    if (!confirm('Deseja realmente excluir?')) return
    try {
      await api.delete(`/transacoes/${id}`)
      carregarDados()
    } catch (error: any) {
      setErro(error.response?.data?.mensagem || 'Erro ao excluir')
    }
  }

  const limpar = () => {
    setDescricao('')
    setValor('')
    setTipo('Despesa')
    setData('')
    setPessoaId('')
    setCategoriaId('')
    setEditando(null)
    setErro('')
  }

  return (
    <div className="page">
      <h2>Gerenciar Transações</h2>

      <div className="form-card">
        <h3>{editando ? 'Editar Transação' : 'Nova Transação'}</h3>
        {erro && <div className="erro">{erro}</div>}

        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          step="0.01"
        />

        <select value={tipo} onChange={(e) => setTipo(e.target.value as 'Receita' | 'Despesa')}>
          <option value="Receita">Receita</option>
          <option value="Despesa">Despesa</option>
        </select>

        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />

        <select value={pessoaId} onChange={(e) => setPessoaId(e.target.value)}>
          <option value="">Selecione uma pessoa</option>
          {pessoas.map((p) => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>

        <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
          <option value="">Selecione uma categoria</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>

        <div className="button-group">
          <button onClick={salvar} className="btn-primary">
            {editando ? 'Atualizar' : 'Cadastrar'}
          </button>
          {editando && (
            <button onClick={limpar} className="btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="table-card">
        <h3>Transações Cadastradas</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Tipo</th>
              <th>Data</th>
              <th>Pessoa</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map((transacao) => (
              <tr key={transacao.id}>
                <td>{transacao.id}</td>
                <td>{transacao.descricao}</td>
                <td className={transacao.tipo === 'Receita' ? 'receita' : 'despesa'}>
                  R$ {transacao.valor.toFixed(2)}
                </td>
                <td>{transacao.tipo}</td>
                <td>{new Date(transacao.data).toLocaleDateString('pt-BR')}</td>
                <td>{transacao.pessoaNome}</td>
                <td>{transacao.categoriaNome}</td>
                <td>
                  <button onClick={() => editar(transacao)} className="btn-edit">
                    Editar
                  </button>
                  <button onClick={() => excluir(transacao.id)} className="btn-delete">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
