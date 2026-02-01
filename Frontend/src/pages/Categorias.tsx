import { useState, useEffect } from 'react'
import api from '../services/api'
import { Categoria } from '../types'
import ConfirmModal from '../components/ConfirmModal'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [nome, setNome] = useState('')
  const [editando, setEditando] = useState<number | null>(null)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [modalExcluir, setModalExcluir] = useState<{ isOpen: boolean; id: number | null; nome: string }>({
    isOpen: false,
    id: null,
    nome: ''
  })

  useEffect(() => {
    carregarCategorias()
  }, [])

  const carregarCategorias = async () => {
    try {
      setLoading(true)
      const response = await api.get('/categorias')
      setCategorias(response.data)
    } catch (error) {
      setErro('Erro ao carregar categorias')
    } finally {
      setLoading(false)
    }
  }

  const salvar = async () => {
    try {
      setErro('')
      setSalvando(true)
      if (editando) {
        await api.put(`/categorias/${editando}`, { id: editando, nome })
      } else {
        await api.post('/categorias', { nome })
      }
      limpar()
      carregarCategorias()
    } catch (error: any) {
      setErro(error.response?.data?.mensagem  'Erro ao salvar')
    } finally {
      setSalvando(false)
    }
  }

  const editar = (categoria: Categoria) => {
    setNome(categoria.nome)
    setEditando(categoria.id)
  }

  const abrirModalExcluir = (id: number, nome: string) => {
    setModalExcluir({ isOpen: true, id, nome })
  }

  const confirmarExclusao = async () => {
    if (!modalExcluir.id) return

    try {
      await api.delete(`/categorias/${modalExcluir.id}`)
      setModalExcluir({ isOpen: false, id: null, nome: '' })
      carregarCategorias()
    } catch (error: any) {
      setErro(error.response?.data?.mensagem  'Erro ao excluir')
      setModalExcluir({ isOpen: false, id: null, nome: '' })
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
          disabled={salvando}
        />

        <div className="button-group">
          <button onClick={salvar} className="btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : editando ? 'Atualizar' : 'Cadastrar'}
          </button>
          {editando && (
            <button onClick={limpar} className="btn-secondary" disabled={salvando}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="table-card">
        <h3>Categorias Cadastradas</h3>
        {loading ? (
          <LoadingSpinner message="Carregando categorias..." />
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Opções</th>
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
                    <button onClick={() => abrirModalExcluir(categoria.id, categoria.nome)} className="btn-delete">
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        isOpen={modalExcluir.isOpen}
        title="Confirmar Exclusão"
        message={
          <div>
            <p>Tem certeza que deseja excluir a categoria:</p>
            <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>{modalExcluir.nome}?</p>
            <p style={{ marginTop: '1rem', color: '#c62828' }}>
              Essa alteração será permanente..
            </p>
          </div>
        }
        onConfirm={confirmarExclusao}
        onCancel={() => setModalExcluir({ isOpen: false, id: null, nome: '' })}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}
