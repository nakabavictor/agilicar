using AgiliCar.API.DTOs.Diagnostico;
using AgiliCar.API.DTOs.OrdemServico;
using AgiliCar.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AgiliCar.API.Controllers;

[ApiController]
[Route("api/ordens-servico")]
[Authorize]
public class OrdensServicoController(
    OrdemServicoService ordemServicoService,
    NotificacaoService notificacaoService,
    FotoService fotoService,
    EmailService emailService,
    WhatsAppService whatsAppService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Listar([FromQuery] string? status)
    {
        var ordens = await ordemServicoService.ListarAsync(status);
        return Ok(ordens);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> ObterPorId(int id)
    {
        var os = await ordemServicoService.ObterPorIdAsync(id);
        if (os is null) return NotFound();
        return Ok(os);
    }

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] OrdemServicoRequest request)
    {
        var os = await ordemServicoService.CriarAsync(request);
        return CreatedAtAction(nameof(ObterPorId), new { id = os.IdOs }, os);
    }

    [HttpPatch("{id:int}/diagnostico")]
    public async Task<IActionResult> SalvarDiagnostico(int id, [FromBody] DiagnosticoRequest request)
    {
        var os = await ordemServicoService.SalvarDiagnosticoAsync(id, request);
        if (os is null) return NotFound();
        return Ok(os);
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> AtualizarStatus(int id, [FromBody] AtualizarStatusRequest request)
    {
        var os = await ordemServicoService.AtualizarStatusAsync(id, request);
        if (os is null) return NotFound();

        _ = Task.Run(async () =>
        {
            await emailService.NotificarStatusOsAsync(os);
            await whatsAppService.NotificarStatusOsAsync(os);
        });

        return Ok(os);
    }

    [HttpPatch("{id:int}/prazo")]
    public async Task<IActionResult> AtualizarPrazo(int id, [FromBody] AtualizarPrazoRequest request)
    {
        var os = await ordemServicoService.AtualizarPrazoAsync(id, request);
        if (os is null) return NotFound();
        return Ok(os);
    }

    [HttpGet("{id:int}/servicos")]
    public async Task<IActionResult> ListarServicos(int id)
    {
        var servicos = await ordemServicoService.ListarServicosAsync(id);
        return Ok(servicos);
    }

    [HttpPost("{id:int}/servicos")]
    public async Task<IActionResult> AdicionarServico(int id, [FromBody] OsServicoRequest request)
    {
        var sucesso = await ordemServicoService.AdicionarServicoAsync(id, request);
        if (!sucesso) return NotFound(new { mensagem = "Ordem de serviço não encontrada." });
        return Ok(new { mensagem = "Serviço adicionado com sucesso." });
    }

    [HttpGet("{id:int}/pecas")]
    public async Task<IActionResult> ListarPecas(int id)
    {
        var pecas = await ordemServicoService.ListarPecasAsync(id);
        return Ok(pecas);
    }

    [HttpPost("{id:int}/pecas")]
    public async Task<IActionResult> AdicionarPeca(int id, [FromBody] OsPecaRequest request)
    {
        var sucesso = await ordemServicoService.AdicionarPecaAsync(id, request);
        if (!sucesso) return NotFound(new { mensagem = "Ordem de serviço não encontrada." });
        return Ok(new { mensagem = "Peça adicionada com sucesso." });
    }

    [HttpGet("{id:int}/notificacoes")]
    public async Task<IActionResult> ListarNotificacoes(int id)
    {
        var notificacoes = await notificacaoService.ListarPorOsAsync(id);
        return Ok(notificacoes);
    }

    [HttpGet("{id:int}/fotos")]
    public async Task<IActionResult> ListarFotos(int id, [FromQuery] string? momento)
    {
        var fotos = await fotoService.ListarPorOsAsync(id, momento);
        return Ok(fotos);
    }

    [HttpPost("{id:int}/fotos")]
    public async Task<IActionResult> UploadFoto(int id, IFormFile arquivo, [FromForm] string momento = "durante", [FromForm] string? descricao = null)
    {
        if (arquivo is null || arquivo.Length == 0)
            return BadRequest(new { mensagem = "Nenhum arquivo enviado." });

        var foto = await fotoService.SalvarAsync(id, arquivo, momento, descricao);
        return Ok(foto);
    }
}
