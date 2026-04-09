namespace BarberShop.Application.DTOs.Blocks;

public class CreateBlockRequest
{
    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;
    public string? Reason { get; set; }
}