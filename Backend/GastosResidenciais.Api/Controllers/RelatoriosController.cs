using GastosResidenciais.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RelatoriosController : ControllerBase
    {
        private readonly IRelatorioService _relatorioService;

        public RelatoriosController(IRelatorioService relatorioService)
        {
            _relatorioService = relatorioService;
        }

        [HttpGet("por-pessoa")]
        public async Task<IActionResult> GetTotaisPorPessoa()
        {
            var dados = await _relatorioService.ObterTotaisPorPessoaAsync();
            return Ok(dados);
        }

        [HttpGet("por-categoria")]
        public async Task<IActionResult> GetTotaisPorCategoria()
        {
            var dados = await _relatorioService.ObterTotaisPorCategoriaAsync();
            return Ok(dados);
        }
    }
}
