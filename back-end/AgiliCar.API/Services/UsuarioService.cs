using AgiliCar.API.Data;
using AgiliCar.API.DTOs.Usuario;
using AgiliCar.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AgiliCar.API.Services;

public class UsuarioService(AgiliCarContext context)
{
    public async Task<List<UsuarioResponse>> ListarAsync(int? idPerfil = null, bool? ativo = null)
    {
        var query = context.Usuarios.Include(u => u.Perfil).AsQueryable();

        if (idPerfil.HasValue)
            query = query.Where(u => u.IdPerfil == idPerfil.Value);

        if (ativo.HasValue)
            query = query.Where(u => u.Ativo == ativo.Value);

        return await query.Select(u => MapToResponse(u)).ToListAsync();
    }

    public async Task<UsuarioResponse?> ObterPorIdAsync(int id)
    {
        var usuario = await context.Usuarios.Include(u => u.Perfil).FirstOrDefaultAsync(u => u.IdUsuario == id);
        return usuario is null ? null : MapToResponse(usuario);
    }

    public async Task<UsuarioResponse> CriarAsync(UsuarioRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Senha))
            throw new ArgumentException("Senha é obrigatória.");

        var usuario = new Usuario
        {
            IdPerfil = request.IdPerfil,
            Nome = request.Nome,
            Email = request.Email,
            Senha = BCrypt.Net.BCrypt.HashPassword(request.Senha)
        };

        context.Usuarios.Add(usuario);
        await context.SaveChangesAsync();

        await context.Entry(usuario).Reference(u => u.Perfil).LoadAsync();
        return MapToResponse(usuario);
    }

    public async Task<UsuarioResponse?> AtualizarAsync(int id, UsuarioRequest request)
    {
        var usuario = await context.Usuarios.Include(u => u.Perfil).FirstOrDefaultAsync(u => u.IdUsuario == id);
        if (usuario is null) return null;

        usuario.Nome = request.Nome;
        usuario.Email = request.Email;
        usuario.IdPerfil = request.IdPerfil;

        if (!string.IsNullOrEmpty(request.Senha))
            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(request.Senha);

        await context.SaveChangesAsync();
        return MapToResponse(usuario);
    }

    public async Task<bool> DesativarAsync(int id)
    {
        var usuario = await context.Usuarios.FindAsync(id);
        if (usuario is null) return false;

        usuario.Ativo = false;
        await context.SaveChangesAsync();
        return true;
    }

    private static UsuarioResponse MapToResponse(Usuario u) => new()
    {
        IdUsuario = u.IdUsuario,
        IdPerfil = u.IdPerfil,
        NomePerfil = u.Perfil?.NomePerfil ?? string.Empty,
        Nome = u.Nome,
        Email = u.Email,
        Ativo = u.Ativo,
        DataCadastro = u.DataCadastro
    };
}
