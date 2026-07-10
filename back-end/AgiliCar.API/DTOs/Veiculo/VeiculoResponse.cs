namespace AgiliCar.API.DTOs.Veiculo;

public class VeiculoResponse
{
    public int IdVeiculo { get; set; }
    public int IdCliente { get; set; }
    public string NomeCliente { get; set; } = string.Empty;
    public string TelefoneCliente { get; set; } = string.Empty;
    public string Placa { get; set; } = string.Empty;
    public string Modelo { get; set; } = string.Empty;
    public string Marca { get; set; } = string.Empty;
    public int? Ano { get; set; }
    public string? Cor { get; set; }
    public string? Chassi { get; set; }
    public string Combustivel { get; set; } = string.Empty;
}
