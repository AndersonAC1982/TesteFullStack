using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GastosResidenciais.Api.Models
{
    public class Transacao
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "A descrição é obrigatória")]
        [StringLength(200, ErrorMessage = "A descrição deve ter no máximo 200 caracteres")]
        public string Descricao { get; set; } = string.Empty;

        [Required(ErrorMessage = "O valor é obrigatório")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Valor { get; set; }

        [Required(ErrorMessage = "O tipo é obrigatório")]
        [StringLength(10)]
        public string Tipo { get; set; } = string.Empty;

        [Required(ErrorMessage = "A data é obrigatória")]
        public DateTime Data { get; set; }

        [Required(ErrorMessage = "A pessoa é obrigatória")]
        public int PessoaId { get; set; }

        [Required(ErrorMessage = "A categoria é obrigatória")]
        public int CategoriaId { get; set; }

        public Pessoa Pessoa { get; set; } = null!;
        public Categoria Categoria { get; set; } = null!;

        public DateTime DataCriacao { get; set; } = DateTime.Now;
    }
}
