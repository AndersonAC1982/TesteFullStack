import { useState, useEffect } from 'react'
import api from '../services/api'

interface Relatorio {
  mes: number
  ano: number
  totalReceitas: number
  totalDespesas: number
  saldo: number
}

export default function Relatorios() {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([])
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarRelatorios()
  }, [])

  const carregarRelatorios = async () => {
    try {
      const res = await api.get('/relatorios')
      setRelatorios(res.data)
    } catch (error: any) {
      setErro(error.response?.data?.mensagem || 'Erro ao carregar relatórios')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Relatórios Mensais</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Mês/Ano</th>
            <th>Receitas</th>
            <th>Despesas</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {relatorios.map((r, i) => (
            <tr key={i}>
              <td>{r.mes}/{r.ano}</td>
              <td>R$ {r.totalReceitas.toFixed(2)}</td>
              <td>R$ {r.totalDespesas.toFixed(2)}</td>
              <td style={{ color: r.saldo >= 0 ? 'green' : 'red' }}>
                R$ {r.saldo.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
