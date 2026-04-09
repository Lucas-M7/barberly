using BarberShop.Domain.Enums;

namespace BarberShop.Domain.Entities;

public class EmailToken
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Token { get; set; } = string.Empty;
    public EmailTokenType Type { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? UsedAt { get; set; }
    public DateTime CreatedAt { get; set; }

    public User User { get; set; } = null!;

    public bool IsValid() => UsedAt is null && ExpiresAt > DateTime.UtcNow;
}