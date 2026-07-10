using AgiliCar.API.Data;
using AgiliCar.API.DTOs.Entrega;
using AgiliCar.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AgiliCar.API.Services;

public class EntregaService(AgiliCarContext context)
{
    public async Task<EntregaResponse?> ObterPorOsAsync(int idOs)
    {
        var entrega = await context.Entregas.FirstOrDefaultAsync(e => e.IdOs == idOs);
        return entrega is null ? null : MapToResponse(entrega);
    }

    public async Task<EntregaResponse> RegistrarAsync(EntregaRequest request)
    {
        var existente = await context.Entregas.FirstOrDefaultAsync(e => e.IdOs == request.IdOs);
        if (existente is not null)
        {
            existente.Confirmacao = true;
            existente.KilometragemSaida = request.KilometragemSaida;
            existente.Observacao = request.Observacao;
            existente.AssinadoCliente = request.AssinadoCliente;
            existente.DataEntrega = DateTime.UtcNow;
            await context.SaveChangesAsync();
            return MapToResponse(existente);
        }

        var entrega = new Entrega
        {
            IdOs = request.IdOs,
            Confirmacao = true,
            KilometragemSaida = request.KilometragemSaida,
            Observacao = request.Observacao,
            AssinadoCliente = request.AssinadoCliente
        };

        context.Entregas.Add(entrega);

        var os = await context.OrdensServico.FindAsync(request.IdOs);
        if (os is not null)
            os.StatusOs = "entregue";

        await context.SaveChangesAsync();
        return MapToResponse(entrega);
    }

    private static EntregaResponse MapToResponse(Entrega e) => new()
    {
        IdEntrega = e.IdEntrega,
        IdOs = e.IdOs,
        DataEntrega = e.DataEntrega,
        Confirmacao = e.Confirmacao,
        KilometragemSaida = e.KilometragemSaida,
        Observacao = e.Observacao,
        AssinadoCliente = e.AssinadoCliente
    };
}
