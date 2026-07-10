using System.ComponentModel.DataAnnotations;

namespace AgiliCar.API.DTOs.Veiculo;

public class VeiculoRequest
{
    [Required]
    public int IdCliente { get; set; }

    [Required]
    [MaxLength(10)]
    public string Placa { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Modelo { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Marca { get; set; } = string.Empty;

    public int? Ano { get; set; }

    [MaxLength(50)]
    public string? Cor { get; set; }

    [MaxLength(17)]
    public string? Chassi { get; set; }

    [MaxLength(20)]
    public string Combustivel { get; set; } = "flex";
}
