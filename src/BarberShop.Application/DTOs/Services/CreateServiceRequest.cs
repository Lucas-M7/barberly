namespace BarberShop.Application.DTOs.Services;

public class CreateServiceRequest
{
    public string Name { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public decimal? Price { get; set; }
}