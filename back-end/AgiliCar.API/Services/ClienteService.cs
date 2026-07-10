using AgiliCar.API.Data;
using AgiliCar.API.DTOs.Cliente;
using AgiliCar.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AgiliCar.API.Services;

public class ClienteService(AgiliCarContext context)
{
    public async Task<List<ClienteResponse>> ListarAsync()
    {
        return await context.Clientes
            .Select(c => MapToResponse(c))
            .ToListAsync();
    }

    public async Task<ClienteResponse?> ObterPorIdAsync(int id)
    {
        var cliente = await context.Clientes.FindAsync(id);
        return cliente is null ? null : MapToResponse(cliente);
    }

    public async Task<ClienteResponse?> ObterPorCpfAsync(string cpf)
    {
        var cliente = await context.Clientes.FirstOrDefaultAsync(c => c.Cpf == cpf);
        return cliente is null ? null : MapToResponse(cliente);
    }

    public async Task<ClienteResponse> CriarAsync(ClienteRequest request)
    {
        var cliente = new Cliente
        {
            Nome = request.Nome,
            Cpf = request.Cpf,
            Telefone = request.Telefone,
            Email = request.Email,
            Endereco = request.Endereco
        };

        context.Clientes.Add(cliente);
        await context.SaveChangesAsync();
        return MapToResponse(cliente);
    }

    public async Task<(bool sucesso, string? erro)> DeletarAsync(int id)
    {
        var cliente = await context.Clientes
            .Include(c => c.Veiculos)
            .Include(c => c.OrdensServico)
            .FirstOrDefaultAsync(c => c.IdCliente == id);

        if (cliente is null) return (false, null);

        if (cliente.Veiculos.Any() || cliente.OrdensServico.Any())
            return (false, "Cliente possui veículos ou ordens de serviço vinculadas e não pode ser excluído.");

        context.Clientes.Remove(cliente);
        await context.SaveChangesAsync();
        return (true, null);
    }

    public async Task<ClienteResponse?> AtualizarAsync(int id, ClienteRequest request)
    {
        var cliente = await context.Clientes.FindAsync(id);
        if (cliente is null) return null;

        cliente.Nome = request.Nome;
        cliente.Cpf = request.Cpf;
        cliente.Telefone = request.Telefone;
        cliente.Email = request.Email;
        cliente.Endereco = request.Endereco;

        await context.SaveChangesAsync();
        return MapToResponse(cliente);
    }

    private static ClienteResponse MapToResponse(Cliente c) => new()
    {
        IdCliente = c.IdCliente,
        Nome = c.Nome,
        Cpf = c.Cpf,
        Telefone = c.Telefone,
        Email = c.Email,
        Endereco = c.Endereco,
        DataCadastro = c.DataCadastro
    };
}
