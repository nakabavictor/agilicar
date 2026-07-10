namespace AgiliCar.API.DTOs.Orcamento;

public class OrcamentoResponse
{
    public int IdOrcamento { get; set; }
    public int IdOs { get; set; }
    public DateTime DataOrcamento { get; set; }
    public decimal ValorTotal { get; set; }
    public string StatusOrcamento { get; set; } = string.Empty;
    public string? Observacoes { get; set; }
}
