namespace AgiliCar.API.Models;

public class Entrega
{
    public int IdEntrega { get; set; }
    public int IdOs { get; set; }
    public DateTime DataEntrega { get; set; } = DateTime.UtcNow;
    public bool Confirmacao { get; set; } = false;
    public int? KilometragemSaida { get; set; }
    public string? Observacao { get; set; }
    public bool AssinadoCliente { get; set; } = false;

    public OrdemServico OrdemServico { get; set; } = null!;
}
