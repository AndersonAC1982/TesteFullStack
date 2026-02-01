using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GastosResidenciais.Api.Models
{
    public class TransacaoInputDto
    {
        [JsonPropertyName("id")]
        public int? Id { get; set; }

        [JsonPropertyName("descricao")]
        [Required(ErrorMessage = "A descrição é obrigatória")]
        [StringLength(200, ErrorMessage = "A descrição deve ter no máximo 200 caracteres")]
        public string Descricao { get; set; } = string.Empty;

        [JsonPropertyName("valor")]
        [Required(ErrorMessage = "O valor é obrigatório")]
        public decimal Valor { get; set; }

        [JsonPropertyName("tipo")]
        [Required(ErrorMessage = "O tipo é obrigatório")]
        [StringLength(10)]
        public string Tipo { get; set; } = string.Empty;

        [JsonPropertyName("data")]
        [Required(ErrorMessage = "A data é obrigatória")]
        public string Data { get; set; } = string.Empty;

        [JsonPropertyName("pessoaId")]
        [Required(ErrorMessage = "A pessoa é obrigatória")]
        public int PessoaId { get; set; }

        [JsonPropertyName("categoriaId")]
        [Required(ErrorMessage = "A categoria é obrigatória")]
        public int CategoriaId { get; set; }
    }
}
