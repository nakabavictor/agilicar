namespace AgiliCar.API.DTOs.Peca;

public class PecaResponse
{
    public int IdPeca { get; set; }
    public string NomePeca { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public string? Codigo { get; set; }
    public string? Fornecedor { get; set; }
    public int Quantidade { get; set; }
    public decimal ValorUnitario { get; set; }
    public int QuantidadeDisponivel { get; set; }
    public int EstoqueMinimo { get; set; }
    public string? Localizacao { get; set; }
    public bool EstoqueCritico { get; set; }
}
