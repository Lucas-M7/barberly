namespace BarberShop.Application.DTOs.Services;

public class UpdateServiceRequest
{
    public string Name { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public decimal? Price { get; set; }
}