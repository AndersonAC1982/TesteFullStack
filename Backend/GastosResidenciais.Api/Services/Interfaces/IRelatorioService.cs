namespace GastosResidenciais.Api.Services.Interfaces
{
    public interface IRelatorioService
    {
        Task<IEnumerable<object>> ObterTotaisPorPessoaAsync();
        Task<IEnumerable<object>> ObterTotaisPorCategoriaAsync();
    }
}