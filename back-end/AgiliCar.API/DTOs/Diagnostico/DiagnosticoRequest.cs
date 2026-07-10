using System.ComponentModel.DataAnnotations;

namespace AgiliCar.API.DTOs.Diagnostico;

public class DiagnosticoRequest
{
    [Required]
    public string DescricaoFalhas { get; set; } = string.Empty;

    [Required]
    public string Severidade { get; set; } = "media";

    public string? ObservacoesTecnicas { get; set; }
}
