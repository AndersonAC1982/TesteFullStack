using System.ComponentModel.DataAnnotations;

namespace GastosResidenciais.Api.Models
{
    public class Pessoa
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome é obrigatório")]
        [StringLength(200, ErrorMessage = "O nome deve ter no máximo 200 caracteres")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "A idade é obrigatória")]
        [Range(0, 150, ErrorMessage = "A idade deve estar entre 0 e 150 anos")]
        public int Idade { get; set; }

        public DateTime DataCriacao { get; set; } = DateTime.Now;

        // Relacionamento: Uma pessoa pode ter várias transações
        // Quando a pessoa for excluída, suas transações também serão (Cascata)
        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }
}