namespace BarberShop.Application.DTOs.Services;

public class ServiceResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public decimal? Price { get; set; }
    public bool IsActive { get; set; }
}