using System.ComponentModel.DataAnnotations;

namespace AgiliCar.API.DTOs.Cliente;

public class ClienteRequest
{
    [Required]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    [MaxLength(14)]
    public string? Cpf { get; set; }

    [MaxLength(20)]
    public string? Telefone { get; set; }

    [EmailAddress]
    [MaxLength(100)]
    public string? Email { get; set; }

    [MaxLength(255)]
    public string? Endereco { get; set; }
}
