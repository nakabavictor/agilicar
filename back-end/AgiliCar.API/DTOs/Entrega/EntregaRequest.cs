using System.ComponentModel.DataAnnotations;

namespace AgiliCar.API.DTOs.Entrega;

public class EntregaRequest
{
    [Required]
    public int IdOs { get; set; }

    public int? KilometragemSaida { get; set; }

    public string? Observacao { get; set; }

    public bool AssinadoCliente { get; set; } = false;
}
