import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Pessoas from './pages/Pessoas'
import Categorias from './pages/Categorias'
import Transacoes from './pages/Transacoes'
import RelatoriosPessoas from './pages/RelatoriosPessoas'
import RelatoriosCategorias from './pages/RelatoriosCategorias'
import './App.css'

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app">
        <nav className="navbar">
          <h1>Gastos Residenciais</h1>
          <div className="nav-links">
            <Link to="/">Pessoas</Link>
            <Link to="/categorias">Categorias</Link>
            <Link to="/transacoes">Transações</Link>
            <Link to="/relatorios-pessoas">Relatório Pessoas</Link>
            <Link to="/relatorios-categorias">Relatório Categorias</Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Pessoas />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/transacoes" element={<Transacoes />} />
            <Route path="/relatorios-pessoas" element={<RelatoriosPessoas />} />
            <Route path="/relatorios-categorias" element={<RelatoriosCategorias />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
