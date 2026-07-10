namespace AgiliCar.API.Models;

public class Servico
{
    public int IdServico { get; set; }
    public string NomeServico { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public decimal Valor { get; set; } = 0;

    public ICollection<OsServico> OrdensServico { get; set; } = [];
}
