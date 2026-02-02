Projeto de gestão financeira doméstica desenvolvido com .NET 8 e React.  
  
SOBRE O PROJETO  
A ideia foi criar uma estrutura limpa usando Services e Interfaces no backend para separar a lógica de negócio dos controllers. Usei SQLite pela praticidade de não precisar configurar banco de dados externo. No frontend, foquei em deixar a interface funcional com máscaras de moeda, filtros dinâmicos e tratamento de erros para a API não retornar erro 500 "seco".  
  
COMO RODAR  
  
Backend:  
- Entrar na pasta Backend/GastosResidenciais.Api  
- Rodar: dotnet run  
- API em: http://localhost:5091  
  
Frontend:  
- Entrar na pasta Frontend  
- Rodar: npm install  
- Rodar: npm run dev  
- App em: http://localhost:5173  
  
FUNCIONALIDADES E REGRAS  
- Cadastro de pessoas e categorias (com validações de unicidade)  
- Lançamento de receitas e despesas com máscara de moeda (R$ 0,00)  
- Regra de idade: Menores de 18 anos só podem registrar despesas  
- Filtro de categorias: Ao lançar uma transação, o sistema filtra as categorias pelo tipo (Receita/Despesa)  
- Relatórios de saldo por morador e categoria com distinção de cores (Verde para saldo positivo e Vermelho para negativo)  
  
BANCO DE DADOS  
Usei SQLite pela praticidade de não precisar configurar banco de dados externo (o arquivo gastos.db é gerado automaticamente na primeira execução).  
  
Anderson Aparecido de Campos - 02/02/2026