using System.ComponentModel.DataAnnotations;

namespace AgiliCar.API.DTOs.OrdemServico;

public class OsPecaRequest
{
    [Required]
    public int IdPeca { get; set; }

    public int Quantidade { get; set; } = 1;

    public decimal ValorUnitario { get; set; } = 0;
}
