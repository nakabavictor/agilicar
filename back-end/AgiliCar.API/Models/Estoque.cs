namespace AgiliCar.API.Models;

public class Estoque
{
    public int IdEstoque { get; set; }
    public int IdPeca { get; set; }
    public int QuantidadeDisponivel { get; set; } = 0;
    public int EstoqueMinimo { get; set; } = 2;
    public string? Localizacao { get; set; }

    public Peca Peca { get; set; } = null!;
}
