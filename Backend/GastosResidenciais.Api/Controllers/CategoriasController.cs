using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GastosResidenciais.Api.Data;
using GastosResidenciais.Api.Models;

namespace GastosResidenciais.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Categorias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
        {
            return await _context.Categorias.ToListAsync();
        }

        // GET: api/Categorias/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Categoria>> GetCategoria(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);

            if (categoria == null)
            {
                return NotFound(new { mensagem = "Categoria não encontrada" });
            }

            return categoria;
        }

        // POST: api/Categorias
        [HttpPost]
        public async Task<ActionResult<Categoria>> PostCategoria(Categoria categoria)
        {
            if (await _context.Categorias.AnyAsync(c => c.Nome == categoria.Nome))
            {
                return BadRequest(new { mensagem = "Categoria já cadastrada" });
            }

            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategoria), new { id = categoria.Id }, categoria);
        }

        // PUT: api/Categorias/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoria(int id, Categoria categoria)
        {
            if (id != categoria.Id)
            {
                return BadRequest(new { mensagem = "ID inconsistente" });
            }

            if (await _context.Categorias.AnyAsync(c => c.Nome == categoria.Nome && c.Id != id))
            {
                return BadRequest(new { mensagem = "Nome de categoria já cadastrado" });
            }

            _context.Entry(categoria).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Categorias.AnyAsync(e => e.Id == id))
                {
                    return NotFound(new { mensagem = "Categoria não encontrada" });
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Categorias/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null)
            {
                return NotFound(new { mensagem = "Categoria não encontrada" });
            }

            if (await _context.Transacoes.AnyAsync(t => t.CategoriaId == id))
            {
                return BadRequest(new { mensagem = "Não é possível excluir categoria com transações cadastradas" });
            }

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
