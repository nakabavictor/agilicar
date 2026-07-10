using System.ComponentModel.DataAnnotations;

namespace AgiliCar.API.DTOs.Notificacao;

public class NotificacaoRequest
{
    [Required]
    public int IdOs { get; set; }

    [Required]
    public string Mensagem { get; set; } = string.Empty;

    public string Tipo { get; set; } = "status";
}
