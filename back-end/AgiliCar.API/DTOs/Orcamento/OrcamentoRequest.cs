using System.ComponentModel.DataAnnotations;

namespace AgiliCar.API.DTOs.Orcamento;

public class OrcamentoRequest
{
    [Required]
    public int IdOs { get; set; }

    [Required]
    public decimal ValorTotal { get; set; }

    public string? Observacoes { get; set; }
}
