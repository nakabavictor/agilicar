namespace AgiliCar.API.Models;

public class Cliente
{
    public int IdCliente { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Cpf { get; set; }
    public string? Telefone { get; set; }
    public string? Email { get; set; }
    public string? Endereco { get; set; }
    public DateOnly DataCadastro { get; set; } = DateOnly.FromDateTime(DateTime.Today);

    public ICollection<Veiculo> Veiculos { get; set; } = [];
    public ICollection<OrdemServico> OrdensServico { get; set; } = [];
}
