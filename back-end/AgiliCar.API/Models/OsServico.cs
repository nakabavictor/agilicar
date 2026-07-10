namespace AgiliCar.API.Models;

public class OsServico
{
    public int IdOs { get; set; }
    public int IdServico { get; set; }
    public int? IdTecnico { get; set; }
    public int Quantidade { get; set; } = 1;
    public decimal ValorCobrado { get; set; } = 0;
    public DateTime? InicioExecucao { get; set; }
    public DateTime? FimExecucao { get; set; }

    public OrdemServico OrdemServico { get; set; } = null!;
    public Servico Servico { get; set; } = null!;
    public Usuario? Tecnico { get; set; }
}
