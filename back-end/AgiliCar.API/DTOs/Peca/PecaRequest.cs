using System.ComponentModel.DataAnnotations;

namespace AgiliCar.API.DTOs.Peca;

public class PecaRequest
{
    [Required]
    [MaxLength(100)]
    public string NomePeca { get; set; } = string.Empty;

    public string? Descricao { get; set; }

    [MaxLength(50)]
    public string? Codigo { get; set; }

    [MaxLength(100)]
    public string? Fornecedor { get; set; }

    public int Quantidade { get; set; } = 0;

    public decimal ValorUnitario { get; set; } = 0;

    public int EstoqueMinimo { get; set; } = 2;

    [MaxLength(100)]
    public string? Localizacao { get; set; }
}
