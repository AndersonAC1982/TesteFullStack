# Sistema de Controle de Gastos Residenciais

Sistema Full Stack para controle de receitas e despesas residenciais desenvolvido com C#/.NET 8 (Backend) e React/TypeScript (Frontend).

---

## Tecnologias Utilizadas

### Backend
- .NET 8 (ASP.NET Core Web API)
- Entity Framework Core (ORM)
- SQLite (banco de dados)
- Swagger (documentação da API)

### Frontend
- React 18
- TypeScript
- Vite (build tool)
- React Router (navegação)
- Axios (requisições HTTP)

---

## Funcionalidades

### CRUD
- **Pessoas**: cadastro com nome e CPF único
- **Categorias**: cadastro com nome único
- **Transações**: cadastro de receitas e despesas com validações

### Regras de Negócio
1. CPF único por pessoa
2. Nome único por categoria
3. Tipo de transação deve ser Receita ou Despesa
4. Valor deve ser sempre positivo
5. Não é possível excluir pessoas ou categorias que possuem transações vinculadas

### Relatórios
- **Totais por Pessoa**: receitas, despesas e saldo de cada pessoa
- **Totais por Categoria**: receitas, despesas e total geral por categoria

---

## Como Executar

### Backend (API)

```bash
cd Backend/GastosResidenciais.Api
dotnet restore
dotnet run
```

A API fica disponível em: http://localhost:5000  
Documentação (Swagger): http://localhost:5000/swagger

### Frontend (React)

```bash
cd Frontend
npm install
npm run dev
```

O frontend fica disponível em: http://localhost:5173

---

## Estrutura do Projeto

**Backend** – `Backend/GastosResidenciais.Api/`
- Controllers, Data, Models
- Program.cs, appsettings.json

**Frontend** – `Frontend/src/`
- pages, services, types
- App.tsx, main.tsx

---

## Endpoints da API

### Pessoas
- GET /api/pessoas - Lista todas
- GET /api/pessoas/{id} - Busca por ID
- POST /api/pessoas - Cria nova
- PUT /api/pessoas/{id} - Atualiza
- DELETE /api/pessoas/{id} - Remove

### Categorias
- GET /api/categorias - Lista todas
- GET /api/categorias/{id} - Busca por ID
- POST /api/categorias - Cria nova
- PUT /api/categorias/{id} - Atualiza
- DELETE /api/categorias/{id} - Remove

### Transações
- GET /api/transacoes - Lista todas
- GET /api/transacoes/{id} - Busca por ID
- POST /api/transacoes - Cria nova
- PUT /api/transacoes/{id} - Atualiza
- DELETE /api/transacoes/{id} - Remove

### Relatórios
- GET /api/relatorios/TotaisPorPessoa - Totais por pessoa
- GET /api/relatorios/TotaisPorCategoria - Totais por categoria

---

## Interface

O sistema possui navegação entre páginas, formulários com validação, tabelas com as informações e feedback visual nas ações. O layout se adapta a diferentes tamanhos de tela.

---

## Observações Técnicas

- O banco SQLite é criado automaticamente na primeira execução
- CORS está configurado para aceitar requisições do frontend
- Validações são feitas tanto no backend quanto no frontend

---


