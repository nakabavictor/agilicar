namespace AgiliCar.API.Models;

public class OrdemServico
{
    public int IdOs { get; set; }
    public int IdCliente { get; set; }
    public int IdVeiculo { get; set; }
    public int IdUsuario { get; set; }
    public DateTime DataAbertura { get; set; } = DateTime.UtcNow;
    public string StatusOs { get; set; } = "aberta";
    public int? Kilometragem { get; set; }
    public string? Descricao { get; set; }
    public string? DescricaoProblema { get; set; }
    public string? Observacoes { get; set; }
    public decimal ValorTotal { get; set; } = 0;
    public DateTime? PrazoEstimado { get; set; }

    public Cliente Cliente { get; set; } = null!;
    public Veiculo Veiculo { get; set; } = null!;
    public Usuario Usuario { get; set; } = null!;
    public Orcamento? Orcamento { get; set; }
    public Entrega? Entrega { get; set; }
    public ICollection<OsServico> Servicos { get; set; } = [];
    public ICollection<OsPeca> Pecas { get; set; } = [];
    public ICollection<RegistroFotografico> Fotos { get; set; } = [];
    public ICollection<Notificacao> Notificacoes { get; set; } = [];
}
