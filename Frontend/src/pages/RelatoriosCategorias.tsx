import { useState, useEffect } from 'react'
import api from '../services/api'
import { TotalPorCategoria } from '../types'

export default function RelatoriosCategorias() {
  const [totais, setTotais] = useState<TotalPorCategoria[]>([])
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarRelatorio()
  }, [])

  const carregarRelatorio = async () => {
    try {
      const response = await api.get('/relatorios/TotaisPorCategoria')
      setTotais(response.data)
    } catch (error) {
      setErro('Erro ao carregar relatório')
    }
  }

  return (
    <div className="page">
      <h2>Relatório de Totais por Categoria</h2>

      {erro && <div className="erro">{erro}</div>}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Total Receitas</th>
              <th>Total Despesas</th>
              <th>Total Geral</th>
            </tr>
          </thead>
          <tbody>
            {totais.map((total) => (
              <tr key={total.categoriaId}>
                <td>{total.categoriaNome}</td>
                <td className="receita">R$ {total.totalReceitas.toFixed(2)}</td>
                <td className="despesa">R$ {total.totalDespesas.toFixed(2)}</td>
                <td className={total.total >= 0 ? 'receita' : 'despesa'}>
                  R$ {total.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-geral">
              <td><strong>Total Geral</strong></td>
              <td className="receita">
                <strong>R$ {totais.reduce((acc, t) => acc + t.totalReceitas, 0).toFixed(2)}</strong>
              </td>
              <td className="despesa">
                <strong>R$ {totais.reduce((acc, t) => acc + t.totalDespesas, 0).toFixed(2)}</strong>
              </td>
              <td className={totais.reduce((acc, t) => acc + t.total, 0) >= 0 ? 'receita' : 'despesa'}>
                <strong>R$ {totais.reduce((acc, t) => acc + t.total, 0).toFixed(2)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
