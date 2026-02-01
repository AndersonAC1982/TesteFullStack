import { useState, useEffect } from 'react'
import api from '../services/api'
import { TotalPorPessoa } from '../types'
import { formatCurrency } from '../utils/masks'
import LoadingSpinner from '../components/LoadingSpinner'

export default function RelatoriosPessoas() {
  const [totais, setTotais] = useState<TotalPorPessoa[]>([])
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarRelatorio()
  }, [])

  const carregarRelatorio = async () => {
    try {
      setLoading(true)
      const response = await api.get('/relatorios/TotaisPorPessoa')
      setTotais(response.data)
    } catch (error) {
      setErro('Erro ao carregar relatório')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h2>Resumo Financeiro por Pessoa</h2>

      {erro && <div className="erro">{erro}</div>}

      <div className="table-card">
        {loading ? (
          <LoadingSpinner message="Carregando relatório..." />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Pessoa</th>
                <th>Total Receitas</th>
                <th>Total Despesas</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {totais.map((total) => (
                <tr key={total.pessoaId}>
                  <td>{total.pessoaNome}</td>
                  <td className="receita">{formatCurrency(total.totalReceitas)}</td>
                  <td className="despesa">{formatCurrency(total.totalDespesas)}</td>
                  <td className={total.saldo >= 0 ? 'receita' : 'despesa'}>
                    {formatCurrency(total.saldo)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-geral">
                <td><strong>Total Geral</strong></td>
                <td className="receita">
                  <strong>{formatCurrency(totais.reduce((acc, t) => acc + t.totalReceitas, 0))}</strong>
                </td>
                <td className="despesa">
                  <strong>{formatCurrency(totais.reduce((acc, t) => acc + t.totalDespesas, 0))}</strong>
                </td>
                <td className={totais.reduce((acc, t) => acc + t.saldo, 0) >= 0 ? 'receita' : 'despesa'}>
                  <strong>{formatCurrency(totais.reduce((acc, t) => acc + t.saldo, 0))}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  )
}
