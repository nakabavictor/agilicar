namespace AgiliCar.API.DTOs.Usuario;

public class UsuarioResponse
{
    public int IdUsuario { get; set; }
    public int IdPerfil { get; set; }
    public string NomePerfil { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool Ativo { get; set; }
    public DateTime DataCadastro { get; set; }
}
