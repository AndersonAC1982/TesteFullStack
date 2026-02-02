using Microsoft.EntityFrameworkCore;
using GastosResidenciais.Api.Data;
using GastosResidenciais.Api.Models;
using GastosResidenciais.Api.Services.Interfaces;

namespace GastosResidenciais.Api.Services
{
    public class PessoaService : IPessoaService
    {
        private readonly AppDbContext _context;

        public PessoaService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Pessoa>> ObterTodasAsync()
        {
            return await _context.Pessoas.ToListAsync();
        }

        public async Task<Pessoa?> ObterPorIdAsync(int id)
        {
            return await _context.Pessoas.FindAsync(id);
        }

        public async Task<Pessoa> CriarAsync(Pessoa pessoa)
        {
            if (string.IsNullOrWhiteSpace(pessoa.Nome))
                throw new ArgumentException("O nome é obrigatório.");

            _context.Pessoas.Add(pessoa);
            await _context.SaveChangesAsync();
            return pessoa;
        }

        public async Task AtualizarAsync(int id, Pessoa pessoa)
        {
            if (id != pessoa.Id)
                throw new ArgumentException("ID inconsistente.");

            var existente = await _context.Pessoas.FindAsync(id);
            if (existente == null)
                throw new KeyNotFoundException("Pessoa não encontrada.");

            existente.Nome = pessoa.Nome;
            existente.Idade = pessoa.Idade;

            await _context.SaveChangesAsync();
        }

        public async Task ExcluirAsync(int id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);
            if (pessoa == null)
                throw new KeyNotFoundException("Pessoa não encontrada.");

            _context.Pessoas.Remove(pessoa);
            await _context.SaveChangesAsync();
        }
    }
}