using System.ComponentModel.DataAnnotations;

namespace AgiliCar.API.DTOs.Orcamento;

public class AtualizarStatusOrcamentoRequest
{
    [Required]
    public string StatusOrcamento { get; set; } = string.Empty;

    public string? ObservacaoCliente { get; set; }
}
