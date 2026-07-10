namespace AgiliCar.API.DTOs.Entrega;

public class EntregaResponse
{
    public int IdEntrega { get; set; }
    public int IdOs { get; set; }
    public DateTime DataEntrega { get; set; }
    public bool Confirmacao { get; set; }
    public int? KilometragemSaida { get; set; }
    public string? Observacao { get; set; }
    public bool AssinadoCliente { get; set; }
}
