using AgiliCar.API.DTOs.Notificacao;
using AgiliCar.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AgiliCar.API.Controllers;

[ApiController]
[Route("api/notificacoes")]
[Authorize]
public class NotificacoesController(NotificacaoService notificacaoService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] NotificacaoRequest request)
    {
        var notificacao = await notificacaoService.CriarAsync(request);
        return Ok(notificacao);
    }
}
