using GastosResidenciais.Api.Models;

namespace GastosResidenciais.Api.Services.Interfaces
{
    // Contrato de serviços relacionados a Pessoa
    public interface IPessoaService
    {
        // Obtém todas as pessoas cadastradas
        Task<IEnumerable<Pessoa>> ObterTodasAsync();

        // Buscaa pessoa por ID
        Task<Pessoa?> ObterPorIdAsync(int id);

        // Cria uma nova pessoa
        Task<Pessoa> CriarAsync(Pessoa pessoa);

        // Atualiza uma pessoa existente
        Task AtualizarAsync(int id, Pessoa pessoa);

        // Exclui uma pessoa
        Task ExcluirAsync(int id);

        // Verifica se existe uma pessoa com o CPF informado
        Task<bool> ExistePorCpfAsync(string cpf, int? idExcluir = null);

        // Verifica se a pessoa possui transações cadastradas
        Task<bool> PossuiTransacoesAsync(int id);
    }
}
