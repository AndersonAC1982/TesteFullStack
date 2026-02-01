using System.ComponentModel.DataAnnotations;

namespace GastosResidenciais.Api.Models
{
    public class Pessoa
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome é obrigatório")]
        [StringLength(100, ErrorMessage = "O nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "O CPF é obrigatório")]
        [StringLength(11, MinimumLength = 11, ErrorMessage = "O CPF deve ter 11 dígitos")]
        public string Cpf { get; set; } = string.Empty;

        public DateTime DataCriacao { get; set; } = DateTime.Now;

        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }
}
