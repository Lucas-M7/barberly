using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;

namespace BarberShop.Application.Services;

public class EmailService(IConfiguration config, ILogger<EmailService> logger)
{
    private readonly string _host = config["Email:Host"] ?? "smtp.gmail.com";
    private readonly int _port = int.Parse(config["Email:Port"] ?? "587");
    private readonly string _username = config["Email:Username"] ?? string.Empty;
    private readonly string _password = config["Email:Password"] ?? string.Empty;
    private readonly string _fromName = config["Email:FromName"] ?? "Noblecut";
    private readonly string _fromAddress = config["Email:FromAddress"] ?? string.Empty;
    private readonly string _frontendUrl = config["App:FrontendUrl"] ?? "http://localhost:3000";

    public async Task SendEmailConfirmationAsync(string toEmail, string toName, string token)
    {
        var link = $"{_frontendUrl}/confirm-email?token={token}";

        var body = $"""
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
                <h2 style="color: #18181b;">✂️ Confirme seu cadastro</h2>
                <p style="color: #52525b;">Olá, <strong>{toName}</strong>!</p>
                <p style="color: #52525b;">Clique no botão abaixo para confirmar seu e-mail e ativar sua conta.</p>
                <a href="{link}"
                   style="display:inline-block;background:#18181b;color:white;
                          padding:12px 24px;border-radius:8px;text-decoration:none;
                          font-weight:bold;margin:16px 0;">
                    Confirmar e-mail
                </a>
                <p style="color:#a1a1aa;font-size:12px;">
                    Este link expira em 24 horas.
                </p>
                <p style="color:#a1a1aa;font-size:12px;">
                    Ou copie: {link}
                </p>
            </div>
            """;

        await SendAsync(toEmail, toName, "Confirme seu e-mail — Noblecut", body);
    }

    public async Task SendPasswordResetAsync(string toEmail, string toName, string token)
    {
        var link = $"{_frontendUrl}/reset-password?token={token}";

        var body = $"""
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
                <h2 style="color: #18181b;">✂️ Recuperação de senha</h2>
                <p style="color: #52525b;">Olá, <strong>{toName}</strong>!</p>
                <p style="color: #52525b;">Clique no botão abaixo para redefinir sua senha.</p>
                <a href="{link}"
                   style="display:inline-block;background:#18181b;color:white;
                          padding:12px 24px;border-radius:8px;text-decoration:none;
                          font-weight:bold;margin:16px 0;">
                    Redefinir senha
                </a>
                <p style="color:#a1a1aa;font-size:12px;">
                    Este link expira em 1 hora.
                </p>
            </div>
            """;

        await SendAsync(toEmail, toName, "Redefinição de senha — Noblecut", body);
    }

    private async Task SendAsync(string toEmail, string toName, string subject, string htmlBody)
    {
        if (string.IsNullOrWhiteSpace(_username) || string.IsNullOrWhiteSpace(_password))
        {
            logger.LogWarning("Credenciais de email não configuradas. Email para {Email} não enviado.", toEmail);
            throw new InvalidOperationException("Serviço de email não configurado.");
        }

        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_fromName, _fromAddress));
            message.To.Add(new MailboxAddress(toName, toEmail));
            message.Subject = subject;
            message.Body = new TextPart("html") { Text = htmlBody };

            using var client = new SmtpClient();
            await client.ConnectAsync(_host, _port, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_username, _password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            logger.LogInformation("Email enviado com sucesso para {Email}", toEmail);
        }
        catch (Exception ex)
        {
            logger.LogError("Falha ao enviar email para {Email}: {Error}", toEmail, ex.Message);
            throw new InvalidOperationException($"Falha ao enviar email: {ex.Message}");
        }
    }
}   