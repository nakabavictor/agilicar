using System.ComponentModel.DataAnnotations;

namespace AgiliCar.API.DTOs.Servico;

public class ServicoRequest
{
    [Required]
    [MaxLength(100)]
    public string NomeServico { get; set; } = string.Empty;

    public string? Descricao { get; set; }

    public decimal Valor { get; set; } = 0;
}
