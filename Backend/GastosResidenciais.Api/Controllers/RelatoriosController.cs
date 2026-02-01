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

        // GET: api/Relatorios/TotaisPorPessoa
        [HttpGet("TotaisPorPessoa")]
        public async Task<ActionResult<IEnumerable<object>>> GetTotaisPorPessoa()
        {
            var transacoes = await _context.Transacoes
                .Include(t => t.Pessoa)
                .ToListAsync();

            var totais = transacoes
                .GroupBy(t => new { t.PessoaId, Nome = t.Pessoa.Nome })
                .Select(g => new
                {
                    PessoaId = g.Key.PessoaId,
                    PessoaNome = g.Key.Nome,
                    TotalReceitas = g.Where(t => t.Tipo == "Receita").Sum(t => t.Valor),
                    TotalDespesas = g.Where(t => t.Tipo == "Despesa").Sum(t => t.Valor),
                    Saldo = g.Where(t => t.Tipo == "Receita").Sum(t => t.Valor) -
                            g.Where(t => t.Tipo == "Despesa").Sum(t => t.Valor)
                })
                .ToList();

            return Ok(totais);
        }

        // GET: api/Relatorios/TotaisPorCategoria
        [HttpGet("TotaisPorCategoria")]
        public async Task<ActionResult<IEnumerable<object>>> GetTotaisPorCategoria()
        {
            var transacoes = await _context.Transacoes
                .Include(t => t.Categoria)
                .ToListAsync();

            var totais = transacoes
                .GroupBy(t => new { t.CategoriaId, Nome = t.Categoria.Nome })
                .Select(g => new
                {
                    CategoriaId = g.Key.CategoriaId,
                    CategoriaNome = g.Key.Nome,
                    TotalReceitas = g.Where(t => t.Tipo == "Receita").Sum(t => t.Valor),
                    TotalDespesas = g.Where(t => t.Tipo == "Despesa").Sum(t => t.Valor),
                    Total = g.Sum(t => t.Tipo == "Receita" ? t.Valor : -t.Valor)
                })
                .ToList();

            return Ok(totais);
        }
    }
}
