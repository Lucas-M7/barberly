using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace BarberShop.Application.Services;

public class EmailService(IConfiguration config, HttpClient httpClient)
{
    private readonly string _apiKey = config["Email:ResendApiKey"]!;
    private readonly string _fromName = config["Email:FromName"]!;
    private readonly string _fromAddress = config["Email:FromAddress"]!;
    private readonly string _frontendUrl = config["App:FrontendUrl"]!;

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
            </div>
            """;

        await SendAsync(toEmail, toName, "Confirme seu e-mail — Barberly", body);
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

        await SendAsync(toEmail, toName, "Redefinição de senha — Barberly", body);
    }

    private async Task SendAsync(string toEmail, string toName, string subject, string htmlBody)
    {
        var payload = new
        {
            from = $"{_fromName} <{_fromAddress}>",
            to = new[] { toEmail },
            subject,
            html = htmlBody
        };

        var json = JsonSerializer.Serialize(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _apiKey);

        var response = await httpClient.PostAsync("https://api.resend.com/emails", content);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new InvalidOperationException($"Falha ao enviar email: {error}");
        }
    }
}