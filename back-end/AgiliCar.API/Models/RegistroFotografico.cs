namespace AgiliCar.API.Models;

public class RegistroFotografico
{
    public int IdFoto { get; set; }
    public int IdOs { get; set; }
    public string Imagem { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public string Momento { get; set; } = "durante";
    public DateTime DataRegistro { get; set; } = DateTime.UtcNow;

    public OrdemServico OrdemServico { get; set; } = null!;
}
