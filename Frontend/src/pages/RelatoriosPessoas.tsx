import { useEffect, useState } from 'react'
import api from '../services/api'
import { formatCurrency } from '../utils/masks'
import LoadingSpinner from '../components/LoadingSpinner'

type LinhaRelatorioPessoa = {
  pessoaNome: string
  saldoTotal: number
}

export default function RelatorioPessoas() {
  const [linhas, setLinhas] = useState<LinhaRelatorioPessoa[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    const carregar = async () => {
      try {
        setLoading(true)
        const response = await api.get<LinhaRelatorioPessoa[]>('/relatorios/pessoas')
        setLinhas(response.data)
      } catch {
        setErro('Erro ao carregar relatório de pessoas.')
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [])

  const totalGeral = linhas.reduce((acc, l) => acc + l.saldoTotal, 0)

  return (
    <div className="page">
      <h2>Relatório de Totais por Pessoa</h2>

      <div className="table-card">
        {erro && <div className="erro">{erro}</div>}

        {loading ? (
          <LoadingSpinner message="Carregando relatório..." />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Pessoa</th>
                <th style={{ textAlign: 'right' }}>Saldo Total</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((linha, i) => (
                <tr key={i}>
                  <td>{linha.pessoaNome}</td>
                  <td 
                    className={linha.saldoTotal > 0 ? 'receita' : linha.saldoTotal < 0 ? 'despesa' : ''} 
                    style={{ textAlign: 'right', fontWeight: 'bold' }}
                  >
                    {formatCurrency(linha.saldoTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Total Geral</td>
                <td
                  className={totalGeral >= 0 ? 'receita' : 'despesa'}
                  style={{ textAlign: 'right', fontWeight: 'bold' }}
                >
                  {formatCurrency(totalGeral)}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  )
}