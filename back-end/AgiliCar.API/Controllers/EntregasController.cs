using AgiliCar.API.DTOs.Entrega;
using AgiliCar.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AgiliCar.API.Controllers;

[ApiController]
[Route("api/entregas")]
[Authorize]
public class EntregasController(EntregaService entregaService) : ControllerBase
{
    [HttpGet("por-os/{idOs:int}")]
    public async Task<IActionResult> ObterPorOs(int idOs)
    {
        var entrega = await entregaService.ObterPorOsAsync(idOs);
        if (entrega is null) return NotFound();
        return Ok(entrega);
    }

    [HttpPost]
    public async Task<IActionResult> Registrar([FromBody] EntregaRequest request)
    {
        var entrega = await entregaService.RegistrarAsync(request);
        return Ok(entrega);
    }
}
