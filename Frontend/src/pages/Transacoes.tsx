import { useState, useEffect } from 'react';
import axios from 'axios';

interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: string;
  data: string;
  pessoaId: number;
  categoriaId: number;
}

// Gerenciamento de lançamentos financeiros Receitas e Despesas
const Transacoes = () => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const res = await axios.get('http:// localhost5000apitransacoes
      setTransacoes(res.data);
    } catch (err) {

    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center">Carregando lançamentos...</p>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Transações</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2">Descrição</th>
            <th className="py-2">Valor</th>
            <th className="py-2">Tipo</th>
            <th className="py-2">Data</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map(t => (
            <tr key={t.id} className="border-b hover:bg-gray-50">
              <td className="py-2">{t.descricao}</td>
              <td className={`py-2 font-bold ${t.tipo === 'Receita' ? 'text-green-600' : 'text-red-600'}`}>
                {t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </td>
              <td className="py-2">{t.tipo}</td>
              <td className="py-2">{new Date(t.data).toLocaleDateString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transacoes;
