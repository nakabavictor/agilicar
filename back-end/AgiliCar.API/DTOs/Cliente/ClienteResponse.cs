namespace AgiliCar.API.DTOs.Cliente;

public class ClienteResponse
{
    public int IdCliente { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Cpf { get; set; }
    public string? Telefone { get; set; }
    public string? Email { get; set; }
    public string? Endereco { get; set; }
    public DateOnly DataCadastro { get; set; }
}
