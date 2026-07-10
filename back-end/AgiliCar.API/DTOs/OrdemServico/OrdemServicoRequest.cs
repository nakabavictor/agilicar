using System.ComponentModel.DataAnnotations;

namespace AgiliCar.API.DTOs.OrdemServico;

public class OrdemServicoRequest
{
    [Required]
    public int IdCliente { get; set; }

    [Required]
    public int IdVeiculo { get; set; }

    [Required]
    public int IdUsuario { get; set; }

    public int? Kilometragem { get; set; }

    public string? Descricao { get; set; }

    public string? DescricaoProblema { get; set; }

    public string? Observacoes { get; set; }
}
