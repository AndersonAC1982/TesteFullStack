import { useState, useEffect } from 'react'
import api from '../services/api'
import { Pessoa } from '../types'

export default function Pessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [editando, setEditando] = useState<number | null>(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarPessoas()
  }, [])

  const carregarPessoas = async () => {
    try {
      const response = await api.get('/pessoas')
      setPessoas(response.data)
    } catch (error) {
      setErro('Erro ao carregar pessoas')
    }
  }

  const salvar = async () => {
    try {
      setErro('')
      if (editando) {
        await api.put(`/pessoas/${editando}`, { id: editando, nome, cpf })
      } else {
        await api.post('/pessoas', { nome, cpf })
      }
      limpar()
      carregarPessoas()
    } catch (error: any) {
      setErro(error.response?.data?.mensagem || 'Erro ao salvar')
    }
  }

  const editar = (pessoa: Pessoa) => {
    setNome(pessoa.nome)
    setCpf(pessoa.cpf)
    setEditando(pessoa.id)
  }

  const excluir = async (id: number) => {
    if (!confirm('Deseja realmente excluir?')) return
    try {
      await api.delete(`/pessoas/${id}`)
      carregarPessoas()
    } catch (error: any) {
      setErro(error.response?.data?.mensagem || 'Erro ao excluir')
    }
  }

  const limpar = () => {
    setNome('')
    setCpf('')
    setEditando(null)
    setErro('')
  }

  return (
    <div className="page">
      <h2>Gerenciar Pessoas</h2>

      <div className="form-card">
        <h3>{editando ? 'Editar Pessoa' : 'Nova Pessoa'}</h3>
        {erro && <div className="erro">{erro}</div>}

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          type="text"
          placeholder="CPF (11 dígitos)"
          value={cpf}
          onChange={(e) => setCpf(e.target.value.replace(/\D/g, '').slice(0, 11))}
          maxLength={11}
        />

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
        <h3>Pessoas Cadastradas</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pessoas.map((pessoa) => (
              <tr key={pessoa.id}>
                <td>{pessoa.id}</td>
                <td>{pessoa.nome}</td>
                <td>{pessoa.cpf}</td>
                <td>
                  <button onClick={() => editar(pessoa)} className="btn-edit">
                    Editar
                  </button>
                  <button onClick={() => excluir(pessoa.id)} className="btn-delete">
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
