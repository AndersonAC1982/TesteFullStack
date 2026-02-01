using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GastosResidenciais.Api.Data;
using GastosResidenciais.Api.Models;

namespace GastosResidenciais.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransacoesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransacoesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Transacoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetTransacoes()
        {
            var transacoes = await _context.Transacoes
                .Include(t => t.Pessoa)
                .Include(t => t.Categoria)
                .Select(t => new
                {
                    t.Id,
                    t.Descricao,
                    t.Valor,
                    t.Tipo,
                    t.Data,
                    t.PessoaId,
                    PessoaNome = t.Pessoa.Nome,
                    t.CategoriaId,
                    CategoriaNome = t.Categoria.Nome,
                    t.DataCriacao
                })
                .ToListAsync();

            return Ok(transacoes);
        }

        // GET: api/Transacoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetTransacao(int id)
        {
            var transacao = await _context.Transacoes
                .Include(t => t.Pessoa)
                .Include(t => t.Categoria)
                .Where(t => t.Id == id)
                .Select(t => new
                {
                    t.Id,
                    t.Descricao,
                    t.Valor,
                    t.Tipo,
                    t.Data,
                    t.PessoaId,
                    PessoaNome = t.Pessoa.Nome,
                    t.CategoriaId,
                    CategoriaNome = t.Categoria.Nome,
                    t.DataCriacao
                })
                .FirstOrDefaultAsync();

            if (transacao == null)
            {
                return NotFound(new { mensagem = "Transação não encontrada" });
            }

            return Ok(transacao);
        }

        // POST: api/Transacoes
        [HttpPost]
        public async Task<ActionResult<Transacao>> PostTransacao([FromBody] TransacaoInputDto dto)
        {
            if (dto == null)
                return BadRequest(new { mensagem = "Dados inválidos" });

            if (dto.Tipo != "Receita" && dto.Tipo != "Despesa")
            {
                return BadRequest(new { mensagem = "Tipo deve ser 'Receita' ou 'Despesa'" });
            }

            if (dto.Valor <= 0)
            {
                return BadRequest(new { mensagem = "O valor deve ser maior que zero" });
            }

            if (!await _context.Pessoas.AnyAsync(p => p.Id == dto.PessoaId))
            {
                return BadRequest(new { mensagem = "Pessoa não encontrada" });
            }

            if (!await _context.Categorias.AnyAsync(c => c.Id == dto.CategoriaId))
            {
                return BadRequest(new { mensagem = "Categoria não encontrada" });
            }

            if (!DateTime.TryParse(dto.Data, out var dataTransacao))
            {
                return BadRequest(new { mensagem = "Data inválida. Use o formato AAAA-MM-DD" });
            }

            var transacao = new Transacao
            {
                Descricao = dto.Descricao,
                Valor = dto.Valor,
                Tipo = dto.Tipo,
                Data = dataTransacao,
                PessoaId = dto.PessoaId,
                CategoriaId = dto.CategoriaId
            };

            _context.Transacoes.Add(transacao);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTransacao), new { id = transacao.Id }, transacao);
        }

        // PUT: api/Transacoes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransacao(int id, [FromBody] TransacaoInputDto dto)
        {
            if (dto == null)
                return BadRequest(new { mensagem = "Dados inválidos" });

            if (dto.Id.HasValue && id != dto.Id.Value)
            {
                return BadRequest(new { mensagem = "ID inconsistente" });
            }

            if (dto.Tipo != "Receita" && dto.Tipo != "Despesa")
            {
                return BadRequest(new { mensagem = "Tipo deve ser 'Receita' ou 'Despesa'" });
            }

            if (dto.Valor <= 0)
            {
                return BadRequest(new { mensagem = "O valor deve ser maior que zero" });
            }

            if (!await _context.Pessoas.AnyAsync(p => p.Id == dto.PessoaId))
            {
                return BadRequest(new { mensagem = "Pessoa não encontrada" });
            }

            if (!await _context.Categorias.AnyAsync(c => c.Id == dto.CategoriaId))
            {
                return BadRequest(new { mensagem = "Categoria não encontrada" });
            }

            if (!DateTime.TryParse(dto.Data, out var dataTransacao))
            {
                return BadRequest(new { mensagem = "Data inválida. Use o formato AAAA-MM-DD" });
            }

            var transacao = await _context.Transacoes.FindAsync(id);
            if (transacao == null)
            {
                return NotFound(new { mensagem = "Transação não encontrada" });
            }

            transacao.Descricao = dto.Descricao;
            transacao.Valor = dto.Valor;
            transacao.Tipo = dto.Tipo;
            transacao.Data = dataTransacao;
            transacao.PessoaId = dto.PessoaId;
            transacao.CategoriaId = dto.CategoriaId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Transacoes.AnyAsync(e => e.Id == id))
                {
                    return NotFound(new { mensagem = "Transação não encontrada" });
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Transacoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransacao(int id)
        {
            var transacao = await _context.Transacoes.FindAsync(id);
            if (transacao == null)
            {
                return NotFound(new { mensagem = "Transação não encontrada" });
            }

            _context.Transacoes.Remove(transacao);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
