using System.ComponentModel.DataAnnotations;

namespace AgiliCar.API.DTOs.OrdemServico;

public class AtualizarStatusRequest
{
    [Required]
    public string StatusOs { get; set; } = string.Empty;
}
