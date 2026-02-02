using GastosResidenciais.Api.Models;

namespace GastosResidenciais.Api.Services.Interfaces
{
    public interface IPessoaService
    {
        Task<IEnumerable<Pessoa>> ObterTodasAsync();
        Task<Pessoa?> ObterPorIdAsync(int id);
        Task<Pessoa> CriarAsync(Pessoa pessoa);
        Task AtualizarAsync(int id, Pessoa pessoa);
        Task ExcluirAsync(int id);
    }
}