namespace AgiliCar.API.Models;

public class Veiculo
{
    public int IdVeiculo { get; set; }
    public int IdCliente { get; set; }
    public string Placa { get; set; } = string.Empty;
    public string Modelo { get; set; } = string.Empty;
    public string Marca { get; set; } = string.Empty;
    public int? Ano { get; set; }
    public string? Cor { get; set; }
    public string? Chassi { get; set; }
    public string Combustivel { get; set; } = "flex";

    public Cliente Cliente { get; set; } = null!;
    public ICollection<OrdemServico> OrdensServico { get; set; } = [];
}
