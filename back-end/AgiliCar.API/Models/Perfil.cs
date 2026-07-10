namespace AgiliCar.API.Models;

public class Perfil
{
    public int IdPerfil { get; set; }
    public string NomePerfil { get; set; } = string.Empty;
    public string? Descricao { get; set; }

    public ICollection<Usuario> Usuarios { get; set; } = [];
}
