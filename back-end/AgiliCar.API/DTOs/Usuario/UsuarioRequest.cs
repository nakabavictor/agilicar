using System.ComponentModel.DataAnnotations;

namespace AgiliCar.API.DTOs.Usuario;

public class UsuarioRequest
{
    [Required]
    public int IdPerfil { get; set; }

    [Required]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [MinLength(6)]
    public string? Senha { get; set; }
}
