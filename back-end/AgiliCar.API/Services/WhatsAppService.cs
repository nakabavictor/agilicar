using AgiliCar.API.DTOs.OrdemServico;
using System.Text;
using System.Text.Json;

namespace AgiliCar.API.Services;

public class WhatsAppService(IConfiguration config, IHttpClientFactory httpClientFactory, ILogger<WhatsAppService> logger)
{
    public async Task EnviarAsync(string telefone, string mensagem)
    {
        var ativo = config.GetValue<bool>("WhatsApp:Ativo");
        var baseUrl = config["WhatsApp:BaseUrl"];

        if (!ativo || string.IsNullOrWhiteSpace(baseUrl))
        {
            logger.LogInformation("[WHATSAPP SIMULADO] Para: {Phone} | {Message}", telefone, mensagem);
            return;
        }

        try
        {
            var numero = FormatarNumero(telefone);
            var instancia = config["WhatsApp:Instancia"] ?? "agilicar";
            var apiKey = config["WhatsApp:ApiKey"] ?? string.Empty;

            var payload = new { number = $"{numero}@c.us", text = mensagem };
            var json = JsonSerializer.Serialize(payload);

            var client = httpClientFactory.CreateClient("WhatsApp");
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("apikey", apiKey);

            var response = await client.PostAsync(
                $"{baseUrl.TrimEnd('/')}/message/sendText/{instancia}",
                new StringContent(json, Encoding.UTF8, "application/json"));

            if (response.IsSuccessStatusCode)
                logger.LogInformation("[WHATSAPP ENVIADO] Para: {Phone}", telefone);
            else
                logger.LogWarning("[WHATSAPP ERRO] Status {Code} para {Phone}", response.StatusCode, telefone);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "[WHATSAPP ERRO] Falha ao enviar para {Phone}", telefone);
        }
    }

    public async Task NotificarStatusOsAsync(OrdemServicoResponse os)
    {
        if (string.IsNullOrWhiteSpace(os.TelefoneCliente)) return;

        var mensagem = GerarMensagem(os);
        if (mensagem is null) return;

        await EnviarAsync(os.TelefoneCliente, mensagem);
    }

    private static string? GerarMensagem(OrdemServicoResponse os)
    {
        var numero = $"OS-{os.IdOs:D6}";
        var veiculo = $"{os.Marca} {os.Modelo}";

        return os.StatusOs switch
        {
            "aguardando_aprovacao" =>
                $"Olá {os.NomeCliente}! O orçamento do seu {veiculo} ({numero}) está pronto. Valor: R$ {os.ValorTotal:F2}. Entre em contato para aprovação. — AgiliCar",

            "em_execucao" =>
                $"Olá {os.NomeCliente}! O serviço do seu {veiculo} ({numero}) foi iniciado. Avisaremos quando estiver pronto! — AgiliCar",

            "concluida" =>
                $"Olá {os.NomeCliente}! Seu {veiculo} ({numero}) está PRONTO para retirada! Compareça à oficina no horário de funcionamento. — AgiliCar",

            "entregue" =>
                $"Olá {os.NomeCliente}! Seu {veiculo} foi entregue com sucesso. Obrigado pela confiança! — AgiliCar",

            _ => null
        };
    }

    private static string FormatarNumero(string telefone)
    {
        var apenas = new string(telefone.Where(char.IsDigit).ToArray());
        if (!apenas.StartsWith("55")) apenas = "55" + apenas;
        return apenas;
    }
}
