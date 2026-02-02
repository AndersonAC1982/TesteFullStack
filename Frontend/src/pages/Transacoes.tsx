import { useState, useEffect } from 'react'
import api from '../services/api'
import { Transacao, Pessoa, Categoria } from '../types'
import { formatCurrency, unmaskCurrency, maskCurrency } from '../utils/masks'
import ConfirmModal from '../components/ConfirmModal'
import LoadingSpinner from '../components/LoadingSpinner'

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
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [modalExcluir, setModalExcluir] = useState<{ isOpen: boolean; id: number | null; descricao: string }>({
    isOpen: false,
    id: null,
    descricao: ''
  })

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  // Lógica para identificar se a pessoa selecionada é menor de idade
  const pessoaSelecionada = pessoas.find(p => p.id === parseInt(pessoaId))
  const ehMenorDeIdade = pessoaSelecionada ? pessoaSelecionada.idade < 18 : false

  // Efeito para forçar "Despesa" se for menor de idade
  useEffect(() => {
    if (ehMenorDeIdade && tipo === 'Receita') {
      setTipo('Despesa')
    }
  }, [ehMenorDeIdade, tipo])

  // Filtra categorias baseada na finalidade (Regra do Teste)
  const categoriasFiltradas = categorias.filter(c => {
    const finalidade = (c as any).tipo // Receita, Despesa ou Ambas
    if (finalidade === 'Ambas') return true
    return finalidade === tipo
  })

  const extrairMensagemErro = (error: any): string => {
    const data = error.response?.data
    return typeof data === 'string' ? data : (data?.mensagem || 'Erro ao processar requisição')
  }

  const salvar = async () => {
    try {
      setErro('')
      setSalvando(true)

      const valorNum = unmaskCurrency(valor)
      const pessoaIdNum = parseInt(pessoaId, 10)
      const categoriaIdNum = parseInt(categoriaId, 10)

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
    } finally {
      setSalvando(false)
    }
  }

  const editar = (transacao: any) => {
    setDescricao(transacao.descricao)
    setValor(formatCurrency(transacao.valor))
    setTipo(transacao.tipo)
    setData(transacao.data.split('T')[0])
    setPessoaId(transacao.pessoaId.toString())
    setCategoriaId(transacao.categoriaId.toString())
    setEditando(transacao.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
  const confirmarExclusao = async () => {
    if (!modalExcluir.id) return
  
    try {
      await api.delete(`/transacoes/${modalExcluir.id}`)
      setModalExcluir({ isOpen: false, id: null, descricao: '' })
      carregarDados()
    } catch (error: any) {
      setErro(error.response?.data?.mensagem || 'Erro ao excluir')
      setModalExcluir({ isOpen: false, id: null, descricao: '' })
    }
  }
  return (
    <div className="page">
      <h2>Gerenciar Transações</h2>

      <div className="form-card">
        <h3>{editando ? 'Editar Transação' : 'Nova Transação'}</h3>
        {erro && <div className="erro" style={{background: '#fee2e2', color: '#b91c1c', border: '1px solid #f87171'}}>{erro}</div>}

        <div className="input-group">
          <label>Descrição</label>
          <input type="text" placeholder="Ex: Aluguel, Salário..." value={descricao} onChange={(e) => setDescricao(e.target.value)} disabled={salvando} />
        </div>

        <div className="input-group">
          <label>Valor (R$)</label>
          <input type="text" placeholder="R$ 0,00" value={valor} onChange={(e) => setValor(maskCurrency(e.target.value))} disabled={salvando} />
        </div>

        <div className="input-group">
          <label>Pessoa</label>
          <select value={pessoaId} onChange={(e) => setPessoaId(e.target.value)} disabled={salvando}>
            <option value="">Selecione uma pessoa...</option>
            {pessoas.map((p) => (
              <option key={p.id} value={p.id}>{p.nome} ({p.idade} anos)</option>
            ))}
          </select>
          {ehMenorDeIdade && <small style={{color: '#d97706', fontWeight: 'bold'}}>⚠️ Menores de 18 anos só podem registrar despesas.</small>}
        </div>

        <div className="input-group">
          <label>Tipo</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value as any)} disabled={salvando || ehMenorDeIdade}>
            <option value="Despesa">Despesa</option>
            {!ehMenorDeIdade && <option value="Receita">Receita</option>}
          </select>
        </div>

        <div className="input-group">
          <label>Categoria (Filtrada por Tipo)</label>
          <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} disabled={salvando}>
            <option value="">Selecione uma categoria...</option>
            {categoriasFiltradas.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Data</label>
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} disabled={salvando} />
        </div>

        <div className="button-group">
          <button onClick={salvar} className="btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : editando ? 'Atualizar' : 'Cadastrar'}
          </button>
          {(editando || descricao) && (
            <button onClick={limpar} className="btn-secondary" disabled={salvando}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="table-card">
        <h3>Transações Cadastradas</h3>
        {loading ? <LoadingSpinner message="Carregando..." /> : (
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Pessoa</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th style={{textAlign: 'right'}}>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((t: any) => (
                <tr key={t.id}>
                  <td>{new Date(t.data).toLocaleDateString('pt-BR')}</td>
                  <td>{t.pessoaNome}</td>
                  <td>{t.descricao}</td>
                  <td>{t.categoriaNome}</td>
                  <td className={t.tipo === 'Receita' ? 'receita' : 'despesa'} style={{textAlign: 'right', fontWeight: 'bold'}}>
                    {t.tipo === 'Receita' ? '+' : '-'} {formatCurrency(t.valor)}
                  </td>
                  <td>
                    <button onClick={() => editar(t)} className="btn-edit">Editar</button>
                    <button onClick={() => setModalExcluir({ isOpen: true, id: t.id, descricao: t.descricao })} className="btn-delete">Excluir</button>
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
        message={`Deseja excluir a transação "${modalExcluir.descricao}"?`}
        onConfirm={confirmarExclusao}
        onCancel={() => setModalExcluir({ isOpen: false, id: null, descricao: '' })}
        type="danger"
      />
    </div>
  )
}