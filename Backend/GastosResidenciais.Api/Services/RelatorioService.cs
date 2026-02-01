using GastosResidenciais.Api.Data;
using GastosResidenciais.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.Api.Services
{
    public class RelatorioService : IRelatorioService
    {
        private readonly AppDbContext _context;

        public RelatorioService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<object> ObterTotaisPorPessoaAsync()
        {
            // Agrupa as transações por pessoa e calcula o saldo líquido Receitas  Despesas
            return await _context.Transacoes
                .Include(t => t.Pessoa)
                .GroupBy(t => t.Pessoa.Nome)
                .Select(g => new
                {
                    Pessoa = g.Key,
                    Total = g.Sum(t => t.Tipo == "Receita" ? t.Valor : -t.Valor)
                })
                .ToListAsync();
        }

        public async Task<object> ObterTotaisPorCategoriaAsync()
        {
            // Consolida os valores gastos ou recebidos por categoria
            return await _context.Transacoes
                .Include(t => t.Categoria)
                .GroupBy(t => t.Categoria.Nome)
                .Select(g => new
                {
                    Categoria = g.Key,
                    Total = g.Sum(t => t.Tipo == "Receita" ? t.Valor : -t.Valor)
                })
                .ToListAsync();
        }
    }
}
