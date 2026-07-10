using AgiliCar.API.Data;
using AgiliCar.API.DTOs.Peca;
using AgiliCar.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AgiliCar.API.Services;

public class PecaService(AgiliCarContext context)
{
    public async Task<List<PecaResponse>> ListarAsync(bool? critico = null)
    {
        var query = context.Pecas.Include(p => p.Estoque).AsQueryable();

        if (critico == true)
            query = query.Where(p => p.Estoque != null && p.Estoque.QuantidadeDisponivel <= p.Estoque.EstoqueMinimo);

        return await query
            .Select(p => MapToResponse(p))
            .ToListAsync();
    }

    public async Task<PecaResponse?> ObterPorIdAsync(int id)
    {
        var peca = await context.Pecas.Include(p => p.Estoque).FirstOrDefaultAsync(p => p.IdPeca == id);
        return peca is null ? null : MapToResponse(peca);
    }

    public async Task<PecaResponse> CriarAsync(PecaRequest request)
    {
        var peca = new Peca
        {
            NomePeca = request.NomePeca,
            Descricao = request.Descricao,
            Codigo = request.Codigo,
            Fornecedor = request.Fornecedor,
            Quantidade = request.Quantidade,
            ValorUnitario = request.ValorUnitario
        };

        context.Pecas.Add(peca);
        await context.SaveChangesAsync();

        var estoque = new Estoque
        {
            IdPeca = peca.IdPeca,
            QuantidadeDisponivel = request.Quantidade,
            EstoqueMinimo = request.EstoqueMinimo,
            Localizacao = request.Localizacao
        };

        context.Estoques.Add(estoque);
        await context.SaveChangesAsync();

        peca.Estoque = estoque;
        return MapToResponse(peca);
    }

    public async Task<PecaResponse?> AtualizarAsync(int id, PecaRequest request)
    {
        var peca = await context.Pecas.Include(p => p.Estoque).FirstOrDefaultAsync(p => p.IdPeca == id);
        if (peca is null) return null;

        peca.NomePeca = request.NomePeca;
        peca.Descricao = request.Descricao;
        peca.Codigo = request.Codigo;
        peca.Fornecedor = request.Fornecedor;
        peca.Quantidade = request.Quantidade;
        peca.ValorUnitario = request.ValorUnitario;

        if (peca.Estoque is not null)
        {
            peca.Estoque.QuantidadeDisponivel = request.Quantidade;
            peca.Estoque.EstoqueMinimo = request.EstoqueMinimo;
            peca.Estoque.Localizacao = request.Localizacao;
        }

        await context.SaveChangesAsync();
        return MapToResponse(peca);
    }

    public async Task<bool> ExcluirAsync(int id)
    {
        var peca = await context.Pecas.FindAsync(id);
        if (peca is null) return false;

        context.Pecas.Remove(peca);
        await context.SaveChangesAsync();
        return true;
    }

    private static PecaResponse MapToResponse(Peca p) => new()
    {
        IdPeca = p.IdPeca,
        NomePeca = p.NomePeca,
        Descricao = p.Descricao,
        Codigo = p.Codigo,
        Fornecedor = p.Fornecedor,
        Quantidade = p.Quantidade,
        ValorUnitario = p.ValorUnitario,
        QuantidadeDisponivel = p.Estoque?.QuantidadeDisponivel ?? 0,
        EstoqueMinimo = p.Estoque?.EstoqueMinimo ?? 2,
        Localizacao = p.Estoque?.Localizacao,
        EstoqueCritico = p.Estoque is not null && p.Estoque.QuantidadeDisponivel <= p.Estoque.EstoqueMinimo
    };
}
