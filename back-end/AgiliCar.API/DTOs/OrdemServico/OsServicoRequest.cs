using System.ComponentModel.DataAnnotations;

namespace AgiliCar.API.DTOs.OrdemServico;

public class OsServicoRequest
{
    [Required]
    public int IdServico { get; set; }

    public int? IdTecnico { get; set; }

    public int Quantidade { get; set; } = 1;

    public decimal ValorCobrado { get; set; } = 0;

    public DateTime? InicioExecucao { get; set; }
}
