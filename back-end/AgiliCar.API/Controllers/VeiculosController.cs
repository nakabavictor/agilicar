using AgiliCar.API.DTOs.Veiculo;
using AgiliCar.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AgiliCar.API.Controllers;

[ApiController]
[Route("api/veiculos")]
[Authorize]
public class VeiculosController(VeiculoService veiculoService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> ListarPorCliente([FromQuery] int idCliente)
    {
        var veiculos = await veiculoService.ListarPorClienteAsync(idCliente);
        return Ok(veiculos);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> ObterPorId(int id)
    {
        var veiculo = await veiculoService.ObterPorIdAsync(id);
        if (veiculo is null) return NotFound();
        return Ok(veiculo);
    }

    [HttpGet("buscar")]
    public async Task<IActionResult> BuscarPorPlaca([FromQuery] string placa)
    {
        if (string.IsNullOrWhiteSpace(placa))
            return BadRequest(new { mensagem = "Placa é obrigatória." });

        var veiculo = await veiculoService.BuscarPorPlacaAsync(placa);
        if (veiculo is null) return NotFound(new { mensagem = "Veículo não encontrado." });
        return Ok(veiculo);
    }

    [HttpGet("{id:int}/historico")]
    public async Task<IActionResult> ObterHistorico(int id)
    {
        var historico = await veiculoService.ObterHistoricoAsync(id);
        return Ok(historico);
    }

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] VeiculoRequest request)
    {
        var veiculo = await veiculoService.CriarAsync(request);
        return CreatedAtAction(nameof(ObterPorId), new { id = veiculo.IdVeiculo }, veiculo);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Atualizar(int id, [FromBody] VeiculoRequest request)
    {
        var veiculo = await veiculoService.AtualizarAsync(id, request);
        if (veiculo is null) return NotFound();
        return Ok(veiculo);
    }
}
