using GastosResidenciais.Api.Models;

namespace GastosResidenciais.Api.Services.Interfaces
{
    // Contrato de serviços relacionados a Transação
    public interface ITransacaoService
    {
        // Obtém todas as transações com informações de pessoa e categoria
        Task<IEnumerable<object>> ObterTodasAsync();

        // Buscaa transação por ID com informações de pessoa e categoria
        Task<object?> ObterPorIdAsync(int id);

        // Cria uma nova transação
        Task<Transacao> CriarAsync(TransacaoInputDto dto);

        // Atualiza uma transação existente
        Task AtualizarAsync(int id, TransacaoInputDto dto);

        // Exclui uma transação
        Task ExcluirAsync(int id);

        // Valida os dados de uma transação
        Task ValidarTransacaoAsync(TransacaoInputDto dto);
    }
}
