using AgiliCar.API.DTOs.Orcamento;
using AgiliCar.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AgiliCar.API.Controllers;

[ApiController]
[Route("api/orcamentos")]
[Authorize]
public class OrcamentosController(OrcamentoService orcamentoService) : ControllerBase
{
    [HttpGet("{id:int}")]
    public async Task<IActionResult> ObterPorId(int id)
    {
        var orcamento = await orcamentoService.ObterPorIdAsync(id);
        if (orcamento is null) return NotFound();
        return Ok(orcamento);
    }

    [HttpGet("por-os/{idOs:int}")]
    public async Task<IActionResult> ObterPorOs(int idOs)
    {
        var orcamento = await orcamentoService.ObterPorOsAsync(idOs);
        if (orcamento is null) return NotFound();
        return Ok(orcamento);
    }

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] OrcamentoRequest request)
    {
        var orcamento = await orcamentoService.CriarAsync(request);
        return CreatedAtAction(nameof(ObterPorId), new { id = orcamento.IdOrcamento }, orcamento);
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> AtualizarStatus(int id, [FromBody] AtualizarStatusOrcamentoRequest request)
    {
        var orcamento = await orcamentoService.AtualizarStatusAsync(id, request);
        if (orcamento is null) return NotFound();
        return Ok(orcamento);
    }
}
