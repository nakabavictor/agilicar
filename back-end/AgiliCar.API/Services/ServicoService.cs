using AgiliCar.API.Data;
using AgiliCar.API.DTOs.Servico;
using AgiliCar.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AgiliCar.API.Services;

public class ServicoService(AgiliCarContext context)
{
    public async Task<List<ServicoResponse>> ListarAsync()
    {
        return await context.Servicos
            .Select(s => MapToResponse(s))
            .ToListAsync();
    }

    public async Task<ServicoResponse?> ObterPorIdAsync(int id)
    {
        var servico = await context.Servicos.FindAsync(id);
        return servico is null ? null : MapToResponse(servico);
    }

    public async Task<ServicoResponse> CriarAsync(ServicoRequest request)
    {
        var servico = new Servico
        {
            NomeServico = request.NomeServico,
            Descricao = request.Descricao,
            Valor = request.Valor
        };

        context.Servicos.Add(servico);
        await context.SaveChangesAsync();
        return MapToResponse(servico);
    }

    public async Task<ServicoResponse?> AtualizarAsync(int id, ServicoRequest request)
    {
        var servico = await context.Servicos.FindAsync(id);
        if (servico is null) return null;

        servico.NomeServico = request.NomeServico;
        servico.Descricao = request.Descricao;
        servico.Valor = request.Valor;

        await context.SaveChangesAsync();
        return MapToResponse(servico);
    }

    public async Task<bool> ExcluirAsync(int id)
    {
        var servico = await context.Servicos.FindAsync(id);
        if (servico is null) return false;

        context.Servicos.Remove(servico);
        await context.SaveChangesAsync();
        return true;
    }

    private static ServicoResponse MapToResponse(Servico s) => new()
    {
        IdServico = s.IdServico,
        NomeServico = s.NomeServico,
        Descricao = s.Descricao,
        Valor = s.Valor
    };
}
