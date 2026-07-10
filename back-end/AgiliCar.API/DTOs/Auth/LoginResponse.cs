namespace AgiliCar.API.DTOs.Auth;

public record LoginResponse(string Token, string NomeUsuario, string Perfil, int IdUsuario);
