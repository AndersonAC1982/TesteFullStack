import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Pessoas from './pages/Pessoas';
import Categorias from './pages/Categorias';
import Transacoes from './pages/Transacoes';
import Relatorios from './pages/Relatorios';

// Estrutura principal da aplicação com definição de rotas e navegação global
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-600">Controle de Gastos</h1>
            <div className="space-x-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600">Pessoas</Link>
              <Link to="/categorias" className="text-gray-600 hover:text-blue-600">Categorias</Link>
              <Link to="/transacoes" className="text-gray-600 hover:text-blue-600">Transações</Link>
              <Link to="/relatorios" className="text-gray-600 hover:text-blue-600">Relatórios</Link>
            </div>
          </div>
        </nav>

        <main className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<Pessoas />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/transacoes" element={<Transacoes />} />
            <Route path="/relatorios" element={<Relatorios />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
