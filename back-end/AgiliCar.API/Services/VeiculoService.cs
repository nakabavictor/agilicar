using AgiliCar.API.Data;
using AgiliCar.API.DTOs.Veiculo;
using AgiliCar.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AgiliCar.API.Services;

public class VeiculoService(AgiliCarContext context)
{
    public async Task<List<VeiculoResponse>> ListarPorClienteAsync(int idCliente)
    {
        return await context.Veiculos
            .Include(v => v.Cliente)
            .Where(v => v.IdCliente == idCliente)
            .Select(v => MapToResponse(v))
            .ToListAsync();
    }

    public async Task<VeiculoResponse?> ObterPorIdAsync(int id)
    {
        var veiculo = await context.Veiculos.Include(v => v.Cliente).FirstOrDefaultAsync(v => v.IdVeiculo == id);
        return veiculo is null ? null : MapToResponse(veiculo);
    }

    public async Task<VeiculoResponse?> BuscarPorPlacaAsync(string placa)
    {
        var veiculo = await context.Veiculos
            .Include(v => v.Cliente)
            .FirstOrDefaultAsync(v => v.Placa == placa.ToUpper());
        return veiculo is null ? null : MapToResponse(veiculo);
    }

    public async Task<List<OrdemServicoHistoricoResponse>> ObterHistoricoAsync(int idVeiculo)
    {
        return await context.OrdensServico
            .Where(os => os.IdVeiculo == idVeiculo)
            .OrderByDescending(os => os.DataAbertura)
            .Select(os => new OrdemServicoHistoricoResponse
            {
                IdOs = os.IdOs,
                DataAbertura = os.DataAbertura,
                StatusOs = os.StatusOs,
                DescricaoProblema = os.DescricaoProblema,
                ValorTotal = os.ValorTotal
            })
            .ToListAsync();
    }

    public async Task<VeiculoResponse> CriarAsync(VeiculoRequest request)
    {
        var placaNorm = request.Placa.ToUpper().Trim();
        var existente = await context.Veiculos
            .Include(v => v.Cliente)
            .FirstOrDefaultAsync(v => v.Placa == placaNorm);
        if (existente is not null)
            return MapToResponse(existente);

        var veiculo = new Veiculo
        {
            IdCliente = request.IdCliente,
            Placa = placaNorm,
            Modelo = request.Modelo,
            Marca = request.Marca,
            Ano = request.Ano,
            Cor = request.Cor,
            Chassi = request.Chassi,
            Combustivel = request.Combustivel
        };

        context.Veiculos.Add(veiculo);
        await context.SaveChangesAsync();

        await context.Entry(veiculo).Reference(v => v.Cliente).LoadAsync();
        return MapToResponse(veiculo);
    }

    public async Task<VeiculoResponse?> AtualizarAsync(int id, VeiculoRequest request)
    {
        var veiculo = await context.Veiculos.Include(v => v.Cliente).FirstOrDefaultAsync(v => v.IdVeiculo == id);
        if (veiculo is null) return null;

        veiculo.Placa = request.Placa.ToUpper();
        veiculo.Modelo = request.Modelo;
        veiculo.Marca = request.Marca;
        veiculo.Ano = request.Ano;
        veiculo.Cor = request.Cor;
        veiculo.Chassi = request.Chassi;
        veiculo.Combustivel = request.Combustivel;

        await context.SaveChangesAsync();
        return MapToResponse(veiculo);
    }

    private static VeiculoResponse MapToResponse(Veiculo v) => new()
    {
        IdVeiculo = v.IdVeiculo,
        IdCliente = v.IdCliente,
        NomeCliente = v.Cliente?.Nome ?? string.Empty,
        TelefoneCliente = v.Cliente?.Telefone ?? string.Empty,
        Placa = v.Placa,
        Modelo = v.Modelo,
        Marca = v.Marca,
        Ano = v.Ano,
        Cor = v.Cor,
        Chassi = v.Chassi,
        Combustivel = v.Combustivel
    };
}

public class OrdemServicoHistoricoResponse
{
    public int IdOs { get; set; }
    public DateTime DataAbertura { get; set; }
    public string StatusOs { get; set; } = string.Empty;
    public string? DescricaoProblema { get; set; }
    public decimal ValorTotal { get; set; }
}
