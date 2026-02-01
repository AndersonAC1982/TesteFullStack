namespace GastosResidenciais.Api.Services.Interfaces
{
    // Contrato de serviços relacionados a Relatórios
    public interface IRelatorioService
    {
        // Obtém totais de receitas despesas e saldo por pessoa
        Task<IEnumerable<object>> ObterTotaisPorPessoaAsync();

        // Obtém totais de receitas despesas por categoria
        Task<IEnumerable<object>> ObterTotaisPorCategoriaAsync();
    }
}
