using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AgiliCar.API.Data;
using AgiliCar.API.DTOs.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AgiliCar.API.Services;

public class AuthService(AgiliCarContext context, IConfiguration configuration)
{
    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        var usuario = await context.Usuarios
            .Include(u => u.Perfil)
            .FirstOrDefaultAsync(u => u.Email == request.Email && u.Ativo);

        if (usuario is null || !BCrypt.Net.BCrypt.Verify(request.Senha, usuario.Senha))
            return null;

        var token = GerarToken(usuario.IdUsuario, usuario.Email, usuario.Perfil.NomePerfil);
        return new LoginResponse(token, usuario.Nome, usuario.Perfil.NomePerfil, usuario.IdUsuario);
    }

    private string GerarToken(int idUsuario, string email, string perfil)
    {
        var jwtSettings = configuration.GetSection("Jwt");
        var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, idUsuario.ToString()),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, perfil)
        };

        var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
