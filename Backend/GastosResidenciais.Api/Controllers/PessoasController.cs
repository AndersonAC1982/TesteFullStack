using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GastosResidenciais.Api.Data;
using GastosResidenciais.Api.Models;

namespace GastosResidenciais.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PessoasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PessoasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Pessoas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pessoa>>> GetPessoas()
        {
            return await _context.Pessoas.ToListAsync();
        }

        // GET: api/Pessoas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Pessoa>> GetPessoa(int id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);

            if (pessoa == null)
            {
                return NotFound(new { mensagem = "Pessoa não encontrada" });
            }

            return pessoa;
        }

        // POST: api/Pessoas
        [HttpPost]
        public async Task<ActionResult<Pessoa>> PostPessoa(Pessoa pessoa)
        {
            if (await _context.Pessoas.AnyAsync(p => p.Cpf == pessoa.Cpf))
            {
                return BadRequest(new { mensagem = "CPF já cadastrado" });
            }

            _context.Pessoas.Add(pessoa);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPessoa), new { id = pessoa.Id }, pessoa);
        }

        // PUT: api/Pessoas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPessoa(int id, Pessoa pessoa)
        {
            if (id != pessoa.Id)
            {
                return BadRequest(new { mensagem = "ID inconsistente" });
            }

            if (await _context.Pessoas.AnyAsync(p => p.Cpf == pessoa.Cpf && p.Id != id))
            {
                return BadRequest(new { mensagem = "CPF já cadastrado para outra pessoa" });
            }

            _context.Entry(pessoa).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Pessoas.AnyAsync(e => e.Id == id))
                {
                    return NotFound(new { mensagem = "Pessoa não encontrada" });
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Pessoas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePessoa(int id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);
            if (pessoa == null)
            {
                return NotFound(new { mensagem = "Pessoa não encontrada" });
            }

            if (await _context.Transacoes.AnyAsync(t => t.PessoaId == id))
            {
                return BadRequest(new { mensagem = "Não é possível excluir pessoa com transações cadastradas" });
            }

            _context.Pessoas.Remove(pessoa);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
