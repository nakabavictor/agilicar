using AgiliCar.API.DTOs.Peca;
using AgiliCar.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AgiliCar.API.Controllers;

[ApiController]
[Route("api/pecas")]
[Authorize]
public class PecasController(PecaService pecaService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Listar([FromQuery] bool? critico)
    {
        var pecas = await pecaService.ListarAsync(critico);
        return Ok(pecas);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> ObterPorId(int id)
    {
        var peca = await pecaService.ObterPorIdAsync(id);
        if (peca is null) return NotFound();
        return Ok(peca);
    }

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] PecaRequest request)
    {
        var peca = await pecaService.CriarAsync(request);
        return CreatedAtAction(nameof(ObterPorId), new { id = peca.IdPeca }, peca);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Atualizar(int id, [FromBody] PecaRequest request)
    {
        var peca = await pecaService.AtualizarAsync(id, request);
        if (peca is null) return NotFound();
        return Ok(peca);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Excluir(int id)
    {
        var sucesso = await pecaService.ExcluirAsync(id);
        if (!sucesso) return NotFound();
        return NoContent();
    }
}
