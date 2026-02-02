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

        public async Task<IEnumerable<object>> ObterTotaisPorPessoaAsync()
        {
            var transacoes = await _context.Transacoes
                .Include(t => t.Pessoa)
                .ToListAsync();

            if (!transacoes.Any())
                return new List<object>();

            return transacoes
                .GroupBy(t => new { t.PessoaId, Nome = t.Pessoa.Nome })
                .Select(g => new
                {
                    pessoaId = g.Key.PessoaId,
                    pessoaNome = g.Key.Nome,
                    totalReceitas = g.Where(t => t.Tipo == "Receita").Sum(t => t.Valor),
                    totalDespesas = g.Where(t => t.Tipo == "Despesa").Sum(t => t.Valor),
                    saldo = g.Sum(t => t.Tipo == "Receita" ? t.Valor : -t.Valor)
                })
                .ToList();
        }

        public async Task<IEnumerable<object>> ObterTotaisPorCategoriaAsync()
        {
            var transacoes = await _context.Transacoes
                .Include(t => t.Categoria)
                .ToListAsync();

            if (!transacoes.Any())
                return new List<object>();

            return transacoes
                .GroupBy(t => new { t.CategoriaId, Nome = t.Categoria.Nome, Tipo = t.Categoria.Tipo })
                .Select(g => new
                {
                    categoriaId = g.Key.CategoriaId,
                    categoriaNome = g.Key.Nome,
                    tipo = g.Key.Tipo,
                    total = g.Sum(t => t.Valor)
                })
                .ToList();
        }
    }
}