CONTROLE DE GASTOS RESIDENCIAIS

Projeto de gestão financeira doméstica desenvolvido com .NET 8 e React.

SOBRE O PROJETO
A ideia foi criar uma estrutura limpa usando Services e Interfaces no backend para separar a lógica de negócio dos controllers. Usei SQLite pela praticidade de não precisar configurar banco de dados externo. No frontend, foquei em deixar a interface funcional com máscaras de CPF/Moeda e tratamento de erros global para a API não retornar erro 500 "seco".

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

FUNCIONALIDADES
- Cadastro de pessoas e categorias (com validações de unicidade)
- Lançamento de receitas e despesas
- Relatórios de saldo por morador e categoria

BANCO DE DADOS
Usei SQLite pela praticidade de não precisar configurar banco de dados externo (o arquivo do banco é gerado automaticamente na primeira execução).

Anderson Aparecido de Campos - 01/02/2026