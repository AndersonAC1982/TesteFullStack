using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GastosResidenciais.Api.Data;

namespace GastosResidenciais.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RelatoriosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RelatoriosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("pessoas")]
        public async Task<IActionResult> GetTotaisPorPessoa()
        {
            // Buscamos os dados brutos e fazemos a soma na memória para evitar erro de tradução do SQLite
            var pessoas = await _context.Pessoas
                .Include(p => p.Transacoes)
                .ToListAsync();

            var dados = pessoas.Select(p => new
            {
                PessoaNome = p.Nome,
                SaldoTotal = p.Transacoes.Sum(t => t.Tipo == "Receita" ? t.Valor : -t.Valor)
            })
            .OrderByDescending(x => x.SaldoTotal)
            .ToList();

            return Ok(dados);
        }

        [HttpGet("categorias")]
        public async Task<IActionResult> GetTotaisPorCategoria()
        {
            var categorias = await _context.Categorias
                .Include(c => c.Transacoes)
                .ToListAsync();

            var dados = categorias.Select(c => new
            {
                CategoriaNome = c.Nome,
                // Se for Receita, valor positivo. Se for Despesa, valor negativo.
                TotalGasto = c.Transacoes.Sum(t => t.Tipo == "Receita" ? t.Valor : -t.Valor)
            })
            // Remove categorias que não possuem nenhuma transação (soma zero)
            .Where(x => x.TotalGasto != 0) 
            .OrderByDescending(x => x.TotalGasto)
            .ToList();

            return Ok(dados);
        }
    }
}