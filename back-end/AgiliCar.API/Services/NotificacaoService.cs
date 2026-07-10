using AgiliCar.API.Data;
using AgiliCar.API.DTOs.Notificacao;
using AgiliCar.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AgiliCar.API.Services;

public class NotificacaoService(AgiliCarContext context)
{
    public async Task<List<NotificacaoResponse>> ListarPorOsAsync(int idOs)
    {
        return await context.Notificacoes
            .Where(n => n.IdOs == idOs)
            .OrderByDescending(n => n.DataEnvio)
            .Select(n => MapToResponse(n))
            .ToListAsync();
    }

    public async Task<NotificacaoResponse> CriarAsync(NotificacaoRequest request)
    {
        var notificacao = new Notificacao
        {
            IdOs = request.IdOs,
            Mensagem = request.Mensagem,
            Tipo = request.Tipo,
            StatusEnvio = "enviado"
        };

        context.Notificacoes.Add(notificacao);
        await context.SaveChangesAsync();
        return MapToResponse(notificacao);
    }

    private static NotificacaoResponse MapToResponse(Notificacao n) => new()
    {
        IdNotificacao = n.IdNotificacao,
        IdOs = n.IdOs,
        Mensagem = n.Mensagem,
        DataEnvio = n.DataEnvio,
        StatusEnvio = n.StatusEnvio,
        Tipo = n.Tipo
    };
}
