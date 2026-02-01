using GastosResidenciais.Api.Models;

namespace GastosResidenciais.Api.Services.Interfaces
{
    // Contrato de serviços relacionados a Categoria
    public interface ICategoriaService
    {
        // Obtém todas as categorias cadastradas
        Task<IEnumerable<Categoria>> ObterTodasAsync();

        // Buscaa categoria por ID
        Task<Categoria?> ObterPorIdAsync(int id);

        // Cria uma nova categoria
        Task<Categoria> CriarAsync(Categoria categoria);

        // Atualiza uma categoria existente
        Task AtualizarAsync(int id, Categoria categoria);

        // Exclui uma categoria
        Task ExcluirAsync(int id);

        // Verifica se existe uma categoria com o nome informado
        Task<bool> ExistePorNomeAsync(string nome, int? idExcluir = null);

        // Verifica se a categoria possui transações cadastradas
        Task<bool> PossuiTransacoesAsync(int id);
    }
}
