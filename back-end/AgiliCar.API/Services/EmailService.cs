using AgiliCar.API.DTOs.OrdemServico;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace AgiliCar.API.Services;

public class EmailService(IConfiguration config, ILogger<EmailService> logger)
{
    public async Task EnviarAsync(string destinatario, string nomeDestinatario, string assunto, string corpoHtml)
    {
        var host = config["Email:Host"];
        if (string.IsNullOrWhiteSpace(host))
        {
            logger.LogInformation("[EMAIL SIMULADO] Para: {To} | Assunto: {Subject}", destinatario, assunto);
            return;
        }

        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(
                config["Email:NomeRemetente"] ?? "AgiliCar",
                config["Email:Remetente"] ?? "noreply@agilicar.com"));
            message.To.Add(new MailboxAddress(nomeDestinatario, destinatario));
            message.Subject = assunto;
            message.Body = new TextPart("html") { Text = corpoHtml };

            using var client = new SmtpClient();
            await client.ConnectAsync(host, int.Parse(config["Email:Port"] ?? "587"), SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(config["Email:Usuario"], config["Email:Senha"]);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            logger.LogInformation("[EMAIL ENVIADO] Para: {To} | Assunto: {Subject}", destinatario, assunto);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "[EMAIL ERRO] Falha ao enviar para {To}", destinatario);
        }
    }

    public async Task NotificarStatusOsAsync(OrdemServicoResponse os)
    {
        if (string.IsNullOrWhiteSpace(os.EmailCliente)) return;

        var (assunto, corpo) = GerarConteudo(os);
        if (assunto is null) return;

        await EnviarAsync(os.EmailCliente, os.NomeCliente, assunto, corpo!);
    }

    private static (string? assunto, string? corpo) GerarConteudo(OrdemServicoResponse os)
    {
        var numero = $"OS-{os.IdOs:D6}";
        var veiculo = $"{os.Marca} {os.Modelo}";

        return os.StatusOs switch
        {
            "aguardando_aprovacao" => (
                $"[AgiliCar] Orçamento disponível — {numero}",
                $"""
                <p>Olá, <strong>{os.NomeCliente}</strong>!</p>
                <p>O orçamento para o seu <strong>{veiculo}</strong> ({numero}) foi concluído.</p>
                <p><strong>Valor total: R$ {os.ValorTotal:F2}</strong></p>
                <p>Entre em contato conosco para aprovação.</p>
                <br><p>Equipe <strong>AgiliCar</strong></p>
                """),

            "em_execucao" => (
                $"[AgiliCar] Serviço iniciado — {numero}",
                $"""
                <p>Olá, <strong>{os.NomeCliente}</strong>!</p>
                <p>O serviço do seu <strong>{veiculo}</strong> ({numero}) foi iniciado.</p>
                <p>Avisaremos quando estiver pronto!</p>
                <br><p>Equipe <strong>AgiliCar</strong></p>
                """),

            "concluida" => (
                $"[AgiliCar] Veículo pronto para retirada — {numero}",
                $"""
                <p>Olá, <strong>{os.NomeCliente}</strong>!</p>
                <p>Seu <strong>{veiculo}</strong> ({numero}) está <strong>pronto para retirada</strong>!</p>
                <p>Compareça à oficina no horário de funcionamento.</p>
                <br><p>Equipe <strong>AgiliCar</strong></p>
                """),

            "entregue" => (
                $"[AgiliCar] Veículo entregue — {numero}",
                $"""
                <p>Olá, <strong>{os.NomeCliente}</strong>!</p>
                <p>Seu <strong>{veiculo}</strong> foi entregue com sucesso. Obrigado pela confiança!</p>
                <br><p>Equipe <strong>AgiliCar</strong></p>
                """),

            _ => (null, null)
        };
    }
}
