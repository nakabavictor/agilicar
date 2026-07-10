namespace AgiliCar.API.DTOs.Notificacao;

public class NotificacaoResponse
{
    public int IdNotificacao { get; set; }
    public int IdOs { get; set; }
    public string Mensagem { get; set; } = string.Empty;
    public DateTime DataEnvio { get; set; }
    public string StatusEnvio { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
}
