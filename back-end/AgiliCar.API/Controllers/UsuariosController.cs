using AgiliCar.API.DTOs.Usuario;
using AgiliCar.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AgiliCar.API.Controllers;

[ApiController]
[Route("api/usuarios")]
[Authorize]
public class UsuariosController(UsuarioService usuarioService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Listar([FromQuery] int? idPerfil, [FromQuery] bool? ativo)
    {
        var usuarios = await usuarioService.ListarAsync(idPerfil, ativo);
        return Ok(usuarios);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> ObterPorId(int id)
    {
        var usuario = await usuarioService.ObterPorIdAsync(id);
        if (usuario is null) return NotFound();
        return Ok(usuario);
    }

    [HttpPost]
    [Authorize(Roles = "gestor")]
    public async Task<IActionResult> Criar([FromBody] UsuarioRequest request)
    {
        try
        {
            var usuario = await usuarioService.CriarAsync(request);
            return CreatedAtAction(nameof(ObterPorId), new { id = usuario.IdUsuario }, usuario);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "gestor")]
    public async Task<IActionResult> Atualizar(int id, [FromBody] UsuarioRequest request)
    {
        var usuario = await usuarioService.AtualizarAsync(id, request);
        if (usuario is null) return NotFound();
        return Ok(usuario);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "gestor")]
    public async Task<IActionResult> Desativar(int id)
    {
        var sucesso = await usuarioService.DesativarAsync(id);
        if (!sucesso) return NotFound();
        return NoContent();
    }
}
