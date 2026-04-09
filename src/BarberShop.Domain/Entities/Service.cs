namespace BarberShop.Domain.Entities;

public class Service
{
    public Guid Id { get; set; }
    public Guid BarberProfileId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public decimal? Price { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public BarberProfile BarberProfile { get; set; } = null!;
}