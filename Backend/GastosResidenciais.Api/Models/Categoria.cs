using System.ComponentModel.DataAnnotations;

namespace GastosResidenciais.Api.Models
{
    public class Categoria
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome da categoria é obrigatório")]
        [StringLength(50, ErrorMessage = "O nome deve ter no máximo 50 caracteres")]
        public string Nome { get; set; } = string.Empty;

        public DateTime DataCriacao { get; set; } = DateTime.Now;

        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }
}
