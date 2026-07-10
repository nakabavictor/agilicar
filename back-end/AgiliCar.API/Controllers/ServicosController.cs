using AgiliCar.API.DTOs.Servico;
using AgiliCar.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AgiliCar.API.Controllers;

[ApiController]
[Route("api/servicos")]
[Authorize]
public class ServicosController(ServicoService servicoService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var servicos = await servicoService.ListarAsync();
        return Ok(servicos);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> ObterPorId(int id)
    {
        var servico = await servicoService.ObterPorIdAsync(id);
        if (servico is null) return NotFound();
        return Ok(servico);
    }

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] ServicoRequest request)
    {
        var servico = await servicoService.CriarAsync(request);
        return CreatedAtAction(nameof(ObterPorId), new { id = servico.IdServico }, servico);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Atualizar(int id, [FromBody] ServicoRequest request)
    {
        var servico = await servicoService.AtualizarAsync(id, request);
        if (servico is null) return NotFound();
        return Ok(servico);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Excluir(int id)
    {
        var sucesso = await servicoService.ExcluirAsync(id);
        if (!sucesso) return NotFound();
        return NoContent();
    }
}
