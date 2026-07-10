namespace AgiliCar.API.Models;

public class Peca
{
    public int IdPeca { get; set; }
    public string NomePeca { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public string? Codigo { get; set; }
    public string? Fornecedor { get; set; }
    public int Quantidade { get; set; } = 0;
    public decimal ValorUnitario { get; set; } = 0;

    public Estoque? Estoque { get; set; }
    public ICollection<OsPeca> OrdensServico { get; set; } = [];
}
