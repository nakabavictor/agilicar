using AgiliCar.API.DTOs.Cliente;
using AgiliCar.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AgiliCar.API.Controllers;

[ApiController]
[Route("api/clientes")]
[Authorize]
public class ClientesController(ClienteService clienteService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var clientes = await clienteService.ListarAsync();
        return Ok(clientes);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> ObterPorId(int id)
    {
        var cliente = await clienteService.ObterPorIdAsync(id);
        if (cliente is null) return NotFound();
        return Ok(cliente);
    }

    [HttpGet("cpf/{cpf}")]
    public async Task<IActionResult> ObterPorCpf(string cpf)
    {
        var cliente = await clienteService.ObterPorCpfAsync(cpf);
        if (cliente is null) return NotFound();
        return Ok(cliente);
    }

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] ClienteRequest request)
    {
        var cliente = await clienteService.CriarAsync(request);
        return CreatedAtAction(nameof(ObterPorId), new { id = cliente.IdCliente }, cliente);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Atualizar(int id, [FromBody] ClienteRequest request)
    {
        var cliente = await clienteService.AtualizarAsync(id, request);
        if (cliente is null) return NotFound();
        return Ok(cliente);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Deletar(int id)
    {
        var (sucesso, erro) = await clienteService.DeletarAsync(id);
        if (!sucesso && erro is null) return NotFound();
        if (!sucesso) return BadRequest(new { mensagem = erro });
        return NoContent();
    }
}
