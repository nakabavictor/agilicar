namespace AgiliCar.API.Models;

public class Orcamento
{
    public int IdOrcamento { get; set; }
    public int IdOs { get; set; }
    public DateTime DataOrcamento { get; set; } = DateTime.UtcNow;
    public decimal ValorTotal { get; set; } = 0;
    public string StatusOrcamento { get; set; } = "pendente";
    public string? Observacoes { get; set; }

    public OrdemServico OrdemServico { get; set; } = null!;
}
