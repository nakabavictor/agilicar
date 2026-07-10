using AgiliCar.API.Data;
using AgiliCar.API.DTOs.Orcamento;
using AgiliCar.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AgiliCar.API.Services;

public class OrcamentoService(AgiliCarContext context)
{
    private static readonly string[] StatusValidos = ["pendente", "aprovado", "reprovado", "cancelado"];

    public async Task<OrcamentoResponse?> ObterPorIdAsync(int id)
    {
        var orcamento = await context.Orcamentos.FindAsync(id);
        return orcamento is null ? null : MapToResponse(orcamento);
    }

    public async Task<OrcamentoResponse?> ObterPorOsAsync(int idOs)
    {
        var orcamento = await context.Orcamentos.FirstOrDefaultAsync(o => o.IdOs == idOs);
        return orcamento is null ? null : MapToResponse(orcamento);
    }

    public async Task<OrcamentoResponse> CriarAsync(OrcamentoRequest request)
    {
        var existente = await context.Orcamentos.FirstOrDefaultAsync(o => o.IdOs == request.IdOs);
        if (existente is not null)
        {
            existente.ValorTotal = request.ValorTotal;
            existente.Observacoes = request.Observacoes;
            existente.StatusOrcamento = "pendente";
            await context.SaveChangesAsync();
            return MapToResponse(existente);
        }

        var orcamento = new Orcamento
        {
            IdOs = request.IdOs,
            ValorTotal = request.ValorTotal,
            Observacoes = request.Observacoes
        };

        context.Orcamentos.Add(orcamento);
        await context.SaveChangesAsync();
        return MapToResponse(orcamento);
    }

    public async Task<OrcamentoResponse?> AtualizarStatusAsync(int id, AtualizarStatusOrcamentoRequest request)
    {
        if (!StatusValidos.Contains(request.StatusOrcamento))
            throw new ArgumentException($"Status inválido: {request.StatusOrcamento}");

        var orcamento = await context.Orcamentos.FindAsync(id);
        if (orcamento is null) return null;

        orcamento.StatusOrcamento = request.StatusOrcamento;
        if (!string.IsNullOrEmpty(request.ObservacaoCliente))
            orcamento.Observacoes = request.ObservacaoCliente;

        var novoStatusOs = request.StatusOrcamento switch
        {
            "aprovado" => "em_execucao",
            "reprovado" => "cancelada",
            _ => null
        };

        if (novoStatusOs is not null)
        {
            var os = await context.OrdensServico.FindAsync(orcamento.IdOs);
            if (os is not null)
                os.StatusOs = novoStatusOs == "cancelada" ? "cancelada" : novoStatusOs;
        }

        await context.SaveChangesAsync();
        return MapToResponse(orcamento);
    }

    private static OrcamentoResponse MapToResponse(Orcamento o) => new()
    {
        IdOrcamento = o.IdOrcamento,
        IdOs = o.IdOs,
        DataOrcamento = o.DataOrcamento,
        ValorTotal = o.ValorTotal,
        StatusOrcamento = o.StatusOrcamento,
        Observacoes = o.Observacoes
    };
}
