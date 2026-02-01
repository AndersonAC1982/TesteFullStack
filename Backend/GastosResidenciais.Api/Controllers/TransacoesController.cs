using Microsoft.AspNetCore.Mvc;
using GastosResidenciais.Api.Models;
using GastosResidenciais.Api.Services.Interfaces;

namespace GastosResidenciais.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransacoesController : ControllerBase
    {
        private readonly ITransacaoService _transacaoService;

        public TransacoesController(ITransacaoService transacaoService)
        {
            _transacaoService = transacaoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetTransacoes()
        {
            var transacoes = await _transacaoService.ObterTodasAsync();
            return Ok(transacoes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetTransacao(int id)
        {
            var transacao = await _transacaoService.ObterPorIdAsync(id);

            if (transacao == null)
            {
                return NotFound("Transação não localizada.");
            }

            return Ok(transacao);
        }

        [HttpPost]
        public async Task<ActionResult<Transacao>> PostTransacao([FromBody] TransacaoInputDto dto)
        {
            try
            {
                var novaTransacao = await _transacaoService.CriarAsync(dto);
                return CreatedAtAction(nameof(GetTransacao), new { id = novaTransacao.Id }, novaTransacao);
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransacao(int id, [FromBody] TransacaoInputDto dto)
        {
            try
            {
                await _transacaoService.AtualizarAsync(id, dto);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransacao(int id)
        {
            try
            {
                await _transacaoService.ExcluirAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
