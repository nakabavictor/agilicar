namespace AgiliCar.API.Models;

public class OsPeca
{
    public int IdOs { get; set; }
    public int IdPeca { get; set; }
    public int Quantidade { get; set; } = 1;
    public decimal ValorUnitario { get; set; } = 0;

    public OrdemServico OrdemServico { get; set; } = null!;
    public Peca Peca { get; set; } = null!;
}
