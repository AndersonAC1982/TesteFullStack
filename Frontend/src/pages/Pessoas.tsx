import { useState, useEffect } from 'react'
import api from '../services/api'
import { Pessoa } from '../types'
import { maskCPF, unmaskCPF } from '../utils/masks'
import ConfirmModal from '../components/ConfirmModal'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Pessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
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
    carregarPessoas()
  }, [])

  const carregarPessoas = async () => {
    try {
      setLoading(true)
      const response = await api.get('/pessoas')
      setPessoas(response.data)
    } catch (error) {
      setErro('Erro ao carregar pessoas')
    } finally {
      setLoading(false)
    }
  }

  const salvar = async () => {
    try {
      setErro('')
      setSalvando(true)
      const cpfSemMascara = unmaskCPF(cpf)

      if (editando) {
        await api.put(`/pessoas/${editando}`, { id: editando, nome, cpf: cpfSemMascara })
      } else {
        await api.post('/pessoas', { nome, cpf: cpfSemMascara })
      }
      limpar()
      carregarPessoas()
    } catch (error: any) {
      setErro(error.response?.data?.mensagem  'Erro ao salvar')
    } finally {
      setSalvando(false)
    }
  }

  const editar = (pessoa: Pessoa) => {
    setNome(pessoa.nome)
    setCpf(maskCPF(pessoa.cpf))
    setEditando(pessoa.id)
  }

  const abrirModalExcluir = (id: number, nome: string) => {
    setModalExcluir({ isOpen: true, id, nome })
  }

  const confirmarExclusao = async () => {
    if (!modalExcluir.id) return

    try {
      await api.delete(`/pessoas/${modalExcluir.id}`)
      setModalExcluir({ isOpen: false, id: null, nome: '' })
      carregarPessoas()
    } catch (error: any) {
      setErro(error.response?.data?.mensagem  'Erro ao excluir')
      setModalExcluir({ isOpen: false, id: null, nome: '' })
    }
  }

  const limpar = () => {
    setNome('')
    setCpf('')
    setEditando(null)
    setErro('')
  }

  const handleCpfChange = (value: string) => {
    setCpf(maskCPF(value))
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
          disabled={salvando}
        />

        <input
          type="text"
          placeholder="CPF (000.000.000-00)"
          value={cpf}
          onChange={(e) => handleCpfChange(e.target.value)}
          maxLength={14}
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
        <h3>Pessoas Cadastradas</h3>
        {loading ? (
          <LoadingSpinner message="Carregando pessoas..." />
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>Opções</th>
              </tr>
            </thead>
            <tbody>
              {pessoas.map((pessoa) => (
                <tr key={pessoa.id}>
                  <td>{pessoa.id}</td>
                  <td>{pessoa.nome}</td>
                  <td>{maskCPF(pessoa.cpf)}</td>
                  <td>
                    <button onClick={() => editar(pessoa)} className="btn-edit">
                      Editar
                    </button>
                    <button onClick={() => abrirModalExcluir(pessoa.id, pessoa.nome)} className="btn-delete">
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
            <p>Tem certeza que deseja excluir a pessoa:</p>
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
