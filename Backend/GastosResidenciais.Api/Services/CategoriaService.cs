using Microsoft.EntityFrameworkCore;
using GastosResidenciais.Api.Data;
using GastosResidenciais.Api.Models;
using GastosResidenciais.Api.Services.Interfaces;

namespace GastosResidenciais.Api.Services
{
    // Serviço para operações relacionadas a Categoria
    public class CategoriaService : ICategoriaService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<CategoriaService> _logger;

        public CategoriaService(AppDbContext context, ILogger<CategoriaService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Categoria>> ObterTodasAsync()
        {
            _logger.LogInformation("Obtendo todas as categorias");
            return await _context.Categorias.ToListAsync();
        }

        public async Task<Categoria?> ObterPorIdAsync(int id)
        {
            _logger.LogInformation("Obtendo categoria por ID: {Id}", id);
            return await _context.Categorias.FindAsync(id);
        }

        public async Task<Categoria> CriarAsync(Categoria categoria)
        {
            _logger.LogInformation("Criando nova categoria: {Nome}", categoria.Nome);

            if (await ExistePorNomeAsync(categoria.Nome))
            {
                throw new InvalidOperationException("Categoria já cadastrada");
            }

            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Categoria criada com sucesso. ID: {Id}", categoria.Id);
            return categoria;
        }

        public async Task AtualizarAsync(int id, Categoria categoria)
        {
            _logger.LogInformation("Atualizando categoria ID: {Id}", id);

            if (id != categoria.Id)
            {
                throw new ArgumentException("ID inconsistente");
            }

            if (await ExistePorNomeAsync(categoria.Nome, id))
            {
                throw new InvalidOperationException("Nome de categoria já cadastrado");
            }

            _context.Entry(categoria).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Categoria atualizada com sucesso. ID: {Id}", id);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Categorias.AnyAsync(e => e.Id == id))
                {
                    throw new KeyNotFoundException("Categoria não encontrada");
                }
                throw;
            }
        }

        public async Task ExcluirAsync(int id)
        {
            _logger.LogInformation("Excluindo categoria ID: {Id}", id);

            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null)
            {
                throw new KeyNotFoundException("Categoria não encontrada");
            }

            if (await PossuiTransacoesAsync(id))
            {
                throw new InvalidOperationException("Não é possível excluir categoria com transações cadastradas");
            }

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Categoria excluída com sucesso. ID: {Id}", id);
        }

        public async Task<bool> ExistePorNomeAsync(string nome, int? idExcluir = null)
        {
            if (idExcluir.HasValue)
            {
                return await _context.Categorias.AnyAsync(c => c.Nome == nome && c.Id != idExcluir.Value);
            }
            return await _context.Categorias.AnyAsync(c => c.Nome == nome);
        }

        public async Task<bool> PossuiTransacoesAsync(int id)
        {
            return await _context.Transacoes.AnyAsync(t => t.CategoriaId == id);
        }
    }
}
