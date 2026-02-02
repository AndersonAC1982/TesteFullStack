using GastosResidenciais.Api.Data;
using GastosResidenciais.Api.Models;
using GastosResidenciais.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.Api.Services;

public class CategoriaService : ICategoriaService
{
    private readonly AppDbContext _context;
    public CategoriaService(AppDbContext context) => _context = context;

    public async Task<IEnumerable<Categoria>> ObterTodasAsync() => await _context.Categorias.ToListAsync();
    public async Task<Categoria?> ObterPorIdAsync(int id) => await _context.Categorias.FindAsync(id);
    public async Task<Categoria> CriarAsync(Categoria categoria)
    {
        _context.Categorias.Add(categoria);
        await _context.SaveChangesAsync();
        return categoria;
    }
    public async Task AtualizarAsync(int id, Categoria categoria)
    {
        _context.Entry(categoria).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }
    public async Task ExcluirAsync(int id)
    {
        var cat = await _context.Categorias.FindAsync(id);
        if (cat != null) { _context.Categorias.Remove(cat); await _context.SaveChangesAsync(); }
    }
    public async Task<bool> ExistePorNomeAsync(string nome, int? idIgnorar = null) => 
        await _context.Categorias.AnyAsync(c => c.Nome == nome && c.Id != idIgnorar);
    public async Task<bool> PossuiTransacoesAsync(int id) => 
        await _context.Transacoes.AnyAsync(t => t.CategoriaId == id);
}