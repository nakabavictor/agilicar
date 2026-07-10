namespace AgiliCar.API.DTOs.OrdemServico;

public class OrdemServicoResponse
{
    public int IdOs { get; set; }
    public int IdCliente { get; set; }
    public string NomeCliente { get; set; } = string.Empty;
    public string TelefoneCliente { get; set; } = string.Empty;
    public string? EmailCliente { get; set; }
    public int IdVeiculo { get; set; }
    public string Placa { get; set; } = string.Empty;
    public string Marca { get; set; } = string.Empty;
    public string Modelo { get; set; } = string.Empty;
    public int? AnoVeiculo { get; set; }
    public int IdUsuario { get; set; }
    public string NomeResponsavel { get; set; } = string.Empty;
    public DateTime DataAbertura { get; set; }
    public string StatusOs { get; set; } = string.Empty;
    public int? Kilometragem { get; set; }
    public string? Descricao { get; set; }
    public string? DescricaoProblema { get; set; }
    public string? Observacoes { get; set; }
    public decimal ValorTotal { get; set; }
    public DateTime? PrazoEstimado { get; set; }
}
