import { useState, useEffect } from 'react'
import api from '../services/api'
import { Pessoa } from '../types'
import ConfirmModal from '../components/ConfirmModal'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Pessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
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
    if (!nome.trim()) {
      setErro('O nome é obrigatório')
      return
    }
    const idadeNum = parseInt(idade)
    if (isNaN(idadeNum) || idadeNum < 0 || idadeNum > 150) {
      setErro('Informe uma idade válida (0 a 150)')
      return
    }

    try {
      setErro('')
      setSalvando(true)
      const dados = { nome: nome.trim(), idade: idadeNum }
      
      if (editando) {
        await api.put(`/pessoas/${editando}`, { id: editando, ...dados })
      } else {
        await api.post('/pessoas', dados)
      }
      limpar()
      carregarPessoas()
    } catch (error: any) {
      setErro(error.response?.data || 'Erro ao salvar pessoa')
    } finally {
      setSalvando(false)
    }
  }

  const editar = (pessoa: Pessoa) => {
    setNome(pessoa.nome)
    setIdade(pessoa.idade.toString())
    setEditando(pessoa.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const limpar = () => {
    setNome('')
    setIdade('')
    setEditando(null)
    setErro('')
  }

  return (
    <div className="page">
      <h2>Gerenciar Pessoas</h2>

      <div className="form-card">
        <h3>{editando ? 'Editar Pessoa' : 'Nova Pessoa'}</h3>
        {erro && <div className="erro" style={{background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '4px', marginBottom: '15px'}}>{erro}</div>}

        <div className="input-group" style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Nome Completo</label>
          <input
            type="text"
            placeholder="Ex: João Silva"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            maxLength={200}
            disabled={salvando}
            style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px'}}
          />
        </div>

        <div className="input-group" style={{marginBottom: '20px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Idade</label>
          <input
            type="number"
            placeholder="Ex: 25"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
            disabled={salvando}
            style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px'}}
          />
        </div>

        <div className="button-group">
          <button onClick={salvar} className="btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : editando ? 'Atualizar' : 'Cadastrar'}
          </button>
          {(editando || nome || idade) && (
            <button onClick={limpar} className="btn-secondary" disabled={salvando} style={{marginLeft: '10px'}}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="table-card" style={{marginTop: '30px'}}>
        <h3>Pessoas Cadastradas</h3>
        {loading ? (
          <LoadingSpinner message="Carregando..." />
        ) : (
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{background: '#5c6bc0', color: 'white'}}>
                <th style={{padding: '12px', textAlign: 'left'}}>ID</th>
                <th style={{padding: '12px', textAlign: 'left'}}>Nome</th>
                <th style={{padding: '12px', textAlign: 'left'}}>Idade</th>
                <th style={{padding: '12px', textAlign: 'center'}}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pessoas.map((p) => (
                <tr key={p.id} style={{borderBottom: '1px solid #eee'}}>
                  <td style={{padding: '12px'}}>{p.id}</td>
                  <td style={{padding: '12px'}}>{p.nome}</td>
                  <td style={{padding: '12px'}}>{p.idade} anos</td>
                  <td style={{padding: '12px', textAlign: 'center'}}>
                    <button onClick={() => editar(p)} className="btn-edit">Editar</button>
                    <button onClick={() => setModalExcluir({ isOpen: true, id: p.id, nome: p.nome })} className="btn-delete" style={{marginLeft: '8px'}}>Excluir</button>
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
        message={`Deseja excluir ${modalExcluir.nome}? Todas as transações vinculadas também serão apagadas.`}
        onConfirm={async () => {
          await api.delete(`/pessoas/${modalExcluir.id}`)
          setModalExcluir({ isOpen: false, id: null, nome: '' })
          carregarPessoas()
        }}
        onCancel={() => setModalExcluir({ isOpen: false, id: null, nome: '' })}
        type="danger"
      />
    </div>
  )
}
