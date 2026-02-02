import { useState, useEffect } from 'react'
import api from '../services/api'
import { Categoria } from '../types'
import ConfirmModal from '../components/ConfirmModal'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState<'Receita' | 'Despesa'>('Despesa')
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
    if (!nome.trim()) {
      setErro('O nome da categoria é obrigatório')
      return
    }

    try {
      setErro('')
      setSalvando(true)
      const dados = { nome, tipo }
      
      if (editando) {
        await api.put(`/categorias/${editando}`, { id: editando, ...dados })
      } else {
        await api.post('/categorias', dados)
      }
      limpar()
      carregarCategorias()
    } catch (error: any) {
      setErro(error.response?.data?.mensagem || 'Erro ao salvar')
    } finally {
      setSalvando(false)
    }
  }

  const editar = (categoria: any) => {
    setNome(categoria.nome)
    setTipo(categoria.tipo || 'Despesa')
    setEditando(categoria.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const limpar = () => {
    setNome('')
    setTipo('Despesa')
    setEditando(null)
    setErro('')
  }

  return (
    <div className="page">
      <h2>Gerenciar Categorias</h2>

      <div className="form-card">
        <h3>{editando ? 'Editar Categoria' : 'Nova Categoria'}</h3>
        {erro && <div className="erro">{erro}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="text"
            placeholder="Nome da Categoria (ex: Salário, Alimentação...)"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={salvando}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '0.9rem', color: '#666' }}>Tipo da Categoria:</label>
            <select 
              value={tipo} 
              onChange={(e) => setTipo(e.target.value as 'Receita' | 'Despesa')} 
              disabled={salvando}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            >
              <option value="Receita">Receita (Entrada de Dinheiro)</option>
              <option value="Despesa">Despesa (Saída de Dinheiro)</option>
            </select>
          </div>
        </div>

        <div className="button-group" style={{ marginTop: '20px' }}>
          <button onClick={salvar} className="btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : editando ? 'Atualizar' : 'Cadastrar'}
          </button>
          {(editando || nome) && (
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
                <th>Tipo</th>
                <th style={{ textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias.length > 0 ? (
                categorias.map((categoria: any) => (
                  <tr key={categoria.id}>
                    <td>{categoria.id}</td>
                    <td><strong>{categoria.nome}</strong></td>
                    <td className={categoria.tipo === 'Receita' ? 'receita' : 'despesa'}>
                      {categoria.tipo}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button onClick={() => editar(categoria)} className="btn-edit">
                        Editar
                      </button>
                      <button onClick={() => setModalExcluir({ isOpen: true, id: categoria.id, nome: categoria.nome })} className="btn-delete">
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center' }}>Nenhuma categoria cadastrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        isOpen={modalExcluir.isOpen}
        title="Confirmar Exclusão"
        message={`Deseja excluir a categoria ${modalExcluir.nome}? Esta ação não pode ser desfeita.`}
        onConfirm={async () => {
          try {
            await api.delete(`/categorias/${modalExcluir.id}`)
            setModalExcluir({ isOpen: false, id: null, nome: '' })
            carregarCategorias()
          } catch (error: any) {
            alert(error.response?.data?.mensagem || 'Erro ao excluir categoria')
          }
        }}
        onCancel={() => setModalExcluir({ isOpen: false, id: null, nome: '' })}
        type="danger"
      />
    </div>
  )
}
