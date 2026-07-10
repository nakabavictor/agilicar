using AgiliCar.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgiliCar.API.Controllers;

[ApiController]
[Route("api/estoque")]
[Authorize]
public class EstoqueController(AgiliCarContext context) : ControllerBase
{
    [HttpGet("movimentacoes")]
    public async Task<IActionResult> Movimentacoes([FromQuery] int? idPeca, [FromQuery] int limite = 200)
    {
        var query = context.OsPecas
            .Include(op => op.OrdemServico)
            .Include(op => op.Peca)
            .AsQueryable();

        if (idPeca.HasValue)
            query = query.Where(op => op.IdPeca == idPeca.Value);

        var movimentacoes = await query
            .OrderByDescending(op => op.OrdemServico.DataAbertura)
            .Take(limite)
            .Select(op => new
            {
                IdOs = op.IdOs,
                NumeroOs = $"OS-{op.IdOs:D6}",
                IdPeca = op.IdPeca,
                NomePeca = op.Peca.NomePeca,
                Quantidade = op.Quantidade,
                ValorUnitario = op.ValorUnitario,
                Tipo = "saida",
                DataAbertura = op.OrdemServico.DataAbertura,
                StatusOs = op.OrdemServico.StatusOs,
            })
            .ToListAsync();

        return Ok(movimentacoes);
    }
}
