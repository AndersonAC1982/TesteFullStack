using GastosResidenciais.Api.Data;
using GastosResidenciais.Api.Models;
using GastosResidenciais.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.Api.Services
{
    public class PessoaService : IPessoaService
    {
        private readonly AppDbContext _context;

        public PessoaService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Pessoa>> ListarTodasAsync()
        {
            return await _context.Pessoas.ToListAsync();
        }

        public async Task<Pessoa?> ObterPorIdAsync(int id)
        {
            return await _context.Pessoas.FindAsync(id);
        }

        public async Task<Pessoa> CriarAsync(Pessoa pessoa)
        {
            _context.Pessoas.Add(pessoa);
            await _context.SaveChangesAsync();
            return pessoa;
        }

        public async Task AtualizarAsync(Pessoa pessoa)
        {
            _context.Entry(pessoa).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeletarAsync(int id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);
            if (pessoa == null) return false;

            // Validação de integridade impede a exclusão se houver transações vinculadas
            var possuiTransacoes = await _context.Transacoes.AnyAsync(t => t.PessoaId == id);
            if (possuiTransacoes)
            {
                throw new InvalidOperationException("Não é possível excluir uma pessoa que possui transações registradas.");
            }

            _context.Pessoas.Remove(pessoa);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
