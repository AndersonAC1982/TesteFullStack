using GastosResidenciais.Api.Models;
using GastosResidenciais.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PessoasController : ControllerBase
    {
        private readonly IPessoaService _pessoaService;

        public PessoasController(IPessoaService pessoaService)
        {
            _pessoaService = pessoaService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pessoa>>> GetPessoas()
        {
            var pessoas = await _pessoaService.ListarTodasAsync();
            return Ok(pessoas);
        }

        [HttpPost]
        public async Task<ActionResult<Pessoa>> PostPessoa(Pessoa pessoa)
        {
            var novaPessoa = await _pessoaService.CriarAsync(pessoa);
            return CreatedAtAction(nameof(GetPessoas), new { id = novaPessoa.Id }, novaPessoa);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePessoa(int id)
        {
            try
            {
                var sucesso = await _pessoaService.DeletarAsync(id);
                if (!sucesso) return NotFound();
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                // Retorna erro de negócio caso a pessoa tenha vínculos ativos
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
