using AgiliCar.API.Data;
using AgiliCar.API.DTOs.Diagnostico;
using AgiliCar.API.DTOs.OrdemServico;
using AgiliCar.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AgiliCar.API.Services;

public class OrdemServicoService(AgiliCarContext context)
{
    private static readonly string[] StatusValidos =
        ["aberta", "em_execucao", "aguardando_peca", "concluida", "entregue", "cancelada"];

    public async Task<List<OrdemServicoResponse>> ListarAsync(string? status)
    {
        var query = context.OrdensServico
            .Include(os => os.Cliente)
            .Include(os => os.Veiculo)
            .Include(os => os.Usuario)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(os => os.StatusOs == status);

        return await query
            .OrderByDescending(os => os.DataAbertura)
            .Select(os => MapToResponse(os))
            .ToListAsync();
    }

    public async Task<OrdemServicoResponse?> ObterPorIdAsync(int id)
    {
        var os = await context.OrdensServico
            .Include(o => o.Cliente)
            .Include(o => o.Veiculo)
            .Include(o => o.Usuario)
            .FirstOrDefaultAsync(o => o.IdOs == id);

        return os is null ? null : MapToResponse(os);
    }

    public async Task<OrdemServicoResponse> CriarAsync(OrdemServicoRequest request)
    {
        var os = new OrdemServico
        {
            IdCliente = request.IdCliente,
            IdVeiculo = request.IdVeiculo,
            IdUsuario = request.IdUsuario,
            Kilometragem = request.Kilometragem,
            Descricao = request.Descricao,
            DescricaoProblema = request.DescricaoProblema,
            Observacoes = request.Observacoes
        };

        context.OrdensServico.Add(os);
        await context.SaveChangesAsync();

        await context.Entry(os).Reference(o => o.Cliente).LoadAsync();
        await context.Entry(os).Reference(o => o.Veiculo).LoadAsync();
        await context.Entry(os).Reference(o => o.Usuario).LoadAsync();

        return MapToResponse(os);
    }

    public async Task<OrdemServicoResponse?> SalvarDiagnosticoAsync(int id, DiagnosticoRequest request)
    {
        var os = await context.OrdensServico
            .Include(o => o.Cliente)
            .Include(o => o.Veiculo)
            .Include(o => o.Usuario)
            .FirstOrDefaultAsync(o => o.IdOs == id);

        if (os is null) return null;

        os.Descricao = request.DescricaoFalhas;
        os.Observacoes = $"[Severidade: {request.Severidade}] {request.ObservacoesTecnicas}".Trim();
        await context.SaveChangesAsync();

        return MapToResponse(os);
    }

    public async Task<OrdemServicoResponse?> AtualizarStatusAsync(int id, AtualizarStatusRequest request)
    {
        if (!StatusValidos.Contains(request.StatusOs))
            throw new ArgumentException($"Status inválido: {request.StatusOs}");

        var os = await context.OrdensServico
            .Include(o => o.Cliente)
            .Include(o => o.Veiculo)
            .Include(o => o.Usuario)
            .FirstOrDefaultAsync(o => o.IdOs == id);

        if (os is null) return null;

        os.StatusOs = request.StatusOs;
        await context.SaveChangesAsync();

        return MapToResponse(os);
    }

    public async Task<bool> AdicionarServicoAsync(int idOs, OsServicoRequest request)
    {
        var os = await context.OrdensServico.FindAsync(idOs);
        if (os is null) return false;

        var existente = await context.OsServicos
            .FindAsync(idOs, request.IdServico);

        if (existente is not null)
        {
            existente.Quantidade = request.Quantidade;
            existente.ValorCobrado = request.ValorCobrado;
            existente.IdTecnico = request.IdTecnico;
        }
        else
        {
            var osServico = new OsServico
            {
                IdOs = idOs,
                IdServico = request.IdServico,
                IdTecnico = request.IdTecnico,
                Quantidade = request.Quantidade,
                ValorCobrado = request.ValorCobrado,
                InicioExecucao = request.InicioExecucao
            };
            context.OsServicos.Add(osServico);
        }

        await RecalcularValorTotalAsync(idOs);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<OrdemServicoResponse?> AtualizarPrazoAsync(int id, AtualizarPrazoRequest request)
    {
        var os = await context.OrdensServico
            .Include(o => o.Cliente)
            .Include(o => o.Veiculo)
            .Include(o => o.Usuario)
            .FirstOrDefaultAsync(o => o.IdOs == id);

        if (os is null) return null;

        os.PrazoEstimado = request.PrazoEstimado;
        await context.SaveChangesAsync();

        return MapToResponse(os);
    }

    public async Task<bool> AdicionarPecaAsync(int idOs, OsPecaRequest request)
    {
        var os = await context.OrdensServico.FindAsync(idOs);
        if (os is null) return false;

        var estoque = await context.Estoques.FirstOrDefaultAsync(e => e.IdPeca == request.IdPeca);

        var existente = await context.OsPecas.FindAsync(idOs, request.IdPeca);

        if (existente is not null)
        {
            var diferenca = request.Quantidade - existente.Quantidade;
            existente.Quantidade = request.Quantidade;
            existente.ValorUnitario = request.ValorUnitario;

            if (estoque is not null)
                estoque.QuantidadeDisponivel -= diferenca;
        }
        else
        {
            var osPeca = new OsPeca
            {
                IdOs = idOs,
                IdPeca = request.IdPeca,
                Quantidade = request.Quantidade,
                ValorUnitario = request.ValorUnitario
            };
            context.OsPecas.Add(osPeca);

            if (estoque is not null)
                estoque.QuantidadeDisponivel -= request.Quantidade;
        }

        await RecalcularValorTotalAsync(idOs);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<List<OsServicoResponse>> ListarServicosAsync(int idOs)
    {
        return await context.OsServicos
            .Include(s => s.Servico)
            .Include(s => s.Tecnico)
            .Where(s => s.IdOs == idOs)
            .Select(s => new OsServicoResponse
            {
                IdServico = s.IdServico,
                NomeServico = s.Servico.NomeServico,
                NomeTecnico = s.Tecnico != null ? s.Tecnico.Nome : null,
                IdTecnico = s.IdTecnico,
                Quantidade = s.Quantidade,
                ValorCobrado = s.ValorCobrado,
                InicioExecucao = s.InicioExecucao,
                FimExecucao = s.FimExecucao
            })
            .ToListAsync();
    }

    public async Task<List<OsPecaResponse>> ListarPecasAsync(int idOs)
    {
        return await context.OsPecas
            .Include(p => p.Peca)
            .Where(p => p.IdOs == idOs)
            .Select(p => new OsPecaResponse
            {
                IdPeca = p.IdPeca,
                NomePeca = p.Peca.NomePeca,
                Quantidade = p.Quantidade,
                ValorUnitario = p.ValorUnitario
            })
            .ToListAsync();
    }

    private async Task RecalcularValorTotalAsync(int idOs)
    {
        var os = await context.OrdensServico.FindAsync(idOs);
        if (os is null) return;

        var totalServicos = await context.OsServicos
            .Where(s => s.IdOs == idOs)
            .SumAsync(s => s.ValorCobrado * s.Quantidade);

        var totalPecas = await context.OsPecas
            .Where(p => p.IdOs == idOs)
            .SumAsync(p => p.ValorUnitario * p.Quantidade);

        os.ValorTotal = totalServicos + totalPecas;
    }

    private static OrdemServicoResponse MapToResponse(OrdemServico os) => new()
    {
        IdOs = os.IdOs,
        IdCliente = os.IdCliente,
        NomeCliente = os.Cliente?.Nome ?? string.Empty,
        TelefoneCliente = os.Cliente?.Telefone ?? string.Empty,
        EmailCliente = os.Cliente?.Email,
        IdVeiculo = os.IdVeiculo,
        Placa = os.Veiculo?.Placa ?? string.Empty,
        Marca = os.Veiculo?.Marca ?? string.Empty,
        Modelo = os.Veiculo?.Modelo ?? string.Empty,
        AnoVeiculo = os.Veiculo?.Ano,
        IdUsuario = os.IdUsuario,
        NomeResponsavel = os.Usuario?.Nome ?? string.Empty,
        DataAbertura = os.DataAbertura,
        StatusOs = os.StatusOs,
        Kilometragem = os.Kilometragem,
        Descricao = os.Descricao,
        DescricaoProblema = os.DescricaoProblema,
        Observacoes = os.Observacoes,
        ValorTotal = os.ValorTotal,
        PrazoEstimado = os.PrazoEstimado
    };
}

public class OsServicoResponse
{
    public int IdServico { get; set; }
    public string NomeServico { get; set; } = string.Empty;
    public int? IdTecnico { get; set; }
    public string? NomeTecnico { get; set; }
    public int Quantidade { get; set; }
    public decimal ValorCobrado { get; set; }
    public DateTime? InicioExecucao { get; set; }
    public DateTime? FimExecucao { get; set; }
}

public class OsPecaResponse
{
    public int IdPeca { get; set; }
    public string NomePeca { get; set; } = string.Empty;
    public int Quantidade { get; set; }
    public decimal ValorUnitario { get; set; }
}
