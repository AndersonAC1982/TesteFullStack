using Microsoft.EntityFrameworkCore;
using GastosResidenciais.Api.Data;
using GastosResidenciais.Api.Models;
using GastosResidenciais.Api.Services.Interfaces;

namespace GastosResidenciais.Api.Services
{
    // Serviço para operações relacionadas a Transação
    public class TransacaoService : ITransacaoService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<TransacaoService> _logger;

        public TransacaoService(AppDbContext context, ILogger<TransacaoService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<object>> ObterTodasAsync()
        {
            _logger.LogInformation("Obtendo todas as transações");
            
            var transacoes = await _context.Transacoes
                .Include(t => t.Pessoa)
                .Include(t => t.Categoria)
                .Select(t => new
                {
                    t.Id,
                    t.Descricao,
                    t.Valor,
                    t.Tipo,
                    t.Data,
                    t.PessoaId,
                    PessoaNome = t.Pessoa.Nome,
                    t.CategoriaId,
                    CategoriaNome = t.Categoria.Nome,
                    t.DataCriacao
                })
                .ToListAsync();

            return transacoes;
        }

        public async Task<object?> ObterPorIdAsync(int id)
        {
            _logger.LogInformation("Obtendo transação por ID: {Id}", id);
            
            var transacao = await _context.Transacoes
                .Include(t => t.Pessoa)
                .Include(t => t.Categoria)
                .Where(t => t.Id == id)
                .Select(t => new
                {
                    t.Id,
                    t.Descricao,
                    t.Valor,
                    t.Tipo,
                    t.Data,
                    t.PessoaId,
                    PessoaNome = t.Pessoa.Nome,
                    t.CategoriaId,
                    CategoriaNome = t.Categoria.Nome,
                    t.DataCriacao
                })
                .FirstOrDefaultAsync();

            return transacao;
        }

        public async Task<Transacao> CriarAsync(TransacaoInputDto dto)
        {
            _logger.LogInformation("Criando nova transação: {Descricao}", dto.Descricao);

            await ValidarTransacaoAsync(dto);

            if (!DateTime.TryParse(dto.Data, out var dataTransacao))
            {
                throw new ArgumentException("Data inválida. Use o formato AAAA-MM-DD");
            }

            var transacao = new Transacao
            {
                Descricao = dto.Descricao,
                Valor = dto.Valor,
                Tipo = dto.Tipo,
                Data = dataTransacao,
                PessoaId = dto.PessoaId,
                CategoriaId = dto.CategoriaId
            };

            _context.Transacoes.Add(transacao);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Transação criada com sucesso. ID: {Id}", transacao.Id);
            return transacao;
        }

        public async Task AtualizarAsync(int id, TransacaoInputDto dto)
        {
            _logger.LogInformation("Atualizando transação ID: {Id}", id);

            if (dto.Id.HasValue && id != dto.Id.Value)
            {
                throw new ArgumentException("ID inconsistente");
            }

            await ValidarTransacaoAsync(dto);

            if (!DateTime.TryParse(dto.Data, out var dataTransacao))
            {
                throw new ArgumentException("Data inválida. Use o formato AAAA-MM-DD");
            }

            var transacao = await _context.Transacoes.FindAsync(id);
            if (transacao == null)
            {
                throw new KeyNotFoundException("Transação não encontrada");
            }

            transacao.Descricao = dto.Descricao;
            transacao.Valor = dto.Valor;
            transacao.Tipo = dto.Tipo;
            transacao.Data = dataTransacao;
            transacao.PessoaId = dto.PessoaId;
            transacao.CategoriaId = dto.CategoriaId;

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Transação atualizada com sucesso. ID: {Id}", id);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Transacoes.AnyAsync(e => e.Id == id))
                {
                    throw new KeyNotFoundException("Transação não encontrada");
                }
                throw;
            }
        }

        public async Task ExcluirAsync(int id)
        {
            _logger.LogInformation("Excluindo transação ID: {Id}", id);

            var transacao = await _context.Transacoes.FindAsync(id);
            if (transacao == null)
            {
                throw new KeyNotFoundException("Transação não encontrada");
            }

            _context.Transacoes.Remove(transacao);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Transação excluída com sucesso. ID: {Id}", id);
        }

        public async Task ValidarTransacaoAsync(TransacaoInputDto dto)
        {
            if (dto == null)
            {
                throw new ArgumentNullException(nameof(dto), "Dados inválidos");
            }

            if (dto.Tipo != "Receita" && dto.Tipo != "Despesa")
            {
                throw new ArgumentException("Tipo deve ser 'Receita' ou 'Despesa'");
            }

            if (dto.Valor <= 0)
            {
                throw new ArgumentException("O valor deve ser maior que zero");
            }

            if (!await _context.Pessoas.AnyAsync(p => p.Id == dto.PessoaId))
            {
                throw new InvalidOperationException("Pessoa não encontrada");
            }

            if (!await _context.Categorias.AnyAsync(c => c.Id == dto.CategoriaId))
            {
                throw new InvalidOperationException("Categoria não encontrada");
            }
        }
    }
}
