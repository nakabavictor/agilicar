namespace AgiliCar.API.Models;

public class Usuario
{
    public int IdUsuario { get; set; }
    public int IdPerfil { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
    public bool Ativo { get; set; } = true;
    public DateTime DataCadastro { get; set; } = DateTime.UtcNow;

    public Perfil Perfil { get; set; } = null!;
    public ICollection<OrdemServico> OrdensServico { get; set; } = [];
    public ICollection<OsServico> ServicosExecutados { get; set; } = [];
}
