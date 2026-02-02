import { useEffect, useState } from 'react'
import api from '../services/api'
import { formatCurrency } from '../utils/masks'
import LoadingSpinner from '../components/LoadingSpinner'

type LinhaRelatorioCategoria = {
  categoriaNome: string
  totalGasto: number
}

export default function RelatorioCategorias() {
  const [linhas, setLinhas] = useState<LinhaRelatorioCategoria[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    const carregar = async () => {
      try {
        setLoading(true)
        const response = await api.get<LinhaRelatorioCategoria[]>('/relatorios/categorias')
        setLinhas(response.data)
      } catch {
        setErro('Erro ao carregar relatório de categorias.')
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [])

  const totalGeral = linhas.reduce((acc, l) => acc + l.totalGasto, 0)

  return (
    <div className="page">
      <h2>Relatório de Totais por Categoria</h2>

      <div className="table-card">
        {erro && <div className="erro">{erro}</div>}

        {loading ? (
          <LoadingSpinner message="Carregando relatório..." />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Categoria</th>
                <th style={{ textAlign: 'right' }}>Total Gasto</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((linha, i) => (
                <tr key={i}>
                  <td>{linha.categoriaNome}</td>
                  <td
                    className={
                      linha.totalGasto > 0
                        ? 'receita'
                        : linha.totalGasto < 0
                        ? 'despesa'
                        : ''
                    }
                    style={{ textAlign: 'right', fontWeight: 'bold' }}
                  >
                    {formatCurrency(linha.totalGasto)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Total Geral</td>
                <td
                  className={
                    totalGeral > 0
                      ? 'receita'
                      : totalGeral < 0
                      ? 'despesa'
                      : ''
                  }
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