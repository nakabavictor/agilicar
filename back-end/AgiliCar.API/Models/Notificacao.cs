namespace AgiliCar.API.Models;

public class Notificacao
{
    public int IdNotificacao { get; set; }
    public int IdOs { get; set; }
    public string Mensagem { get; set; } = string.Empty;
    public DateTime DataEnvio { get; set; } = DateTime.UtcNow;
    public string StatusEnvio { get; set; } = "pendente";
    public string Tipo { get; set; } = "status";

    public OrdemServico OrdemServico { get; set; } = null!;
}
