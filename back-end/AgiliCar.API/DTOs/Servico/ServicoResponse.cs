namespace AgiliCar.API.DTOs.Servico;

public class ServicoResponse
{
    public int IdServico { get; set; }
    public string NomeServico { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public decimal Valor { get; set; }
}
