import { useState, useEffect } from 'react'
import api from '../services/api'
import { Categoria } from '../types'

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [nome, setNome] = useState('')
  const [editando, setEditando] = useState<number | null>(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarCategorias()
  }, [])

  const carregarCategorias = async () => {
    try {
      const response = await api.get('/categorias')
      setCategorias(response.data)
    } catch (error) {
      setErro('Erro ao carregar categorias')
    }
  }

  const salvar = async () => {
    try {
      setErro('')
      if (editando) {
        await api.put(`/categorias/${editando}`, { id: editando, nome })
      } else {
        await api.post('/categorias', { nome })
      }
      limpar()
      carregarCategorias()
    } catch (error: any) {
      setErro(error.response?.data?.mensagem || 'Erro ao salvar')
    }
  }

  const editar = (categoria: Categoria) => {
    setNome(categoria.nome)
    setEditando(categoria.id)
  }

  const excluir = async (id: number) => {
    if (!confirm('Deseja realmente excluir?')) return
    try {
      await api.delete(`/categorias/${id}`)
      carregarCategorias()
    } catch (error: any) {
      setErro(error.response?.data?.mensagem || 'Erro ao excluir')
    }
  }

  const limpar = () => {
    setNome('')
    setEditando(null)
    setErro('')
  }

  return (
    <div className="page">
      <h2>Gerenciar Categorias</h2>

      <div className="form-card">
        <h3>{editando ? 'Editar Categoria' : 'Nova Categoria'}</h3>
        {erro && <div className="erro">{erro}</div>}

        <input
          type="text"
          placeholder="Nome da Categoria"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
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
        <h3>Categorias Cadastradas</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.id}</td>
                <td>{categoria.nome}</td>
                <td>
                  <button onClick={() => editar(categoria)} className="btn-edit">
                    Editar
                  </button>
                  <button onClick={() => excluir(categoria.id)} className="btn-delete">
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
