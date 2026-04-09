namespace BarberShop.Application.DTOs.SpecialHours;

public class SpecialHourResponse
{
    public Guid Id { get; set; }
    public string Date { get; set; } = string.Empty;
    public bool IsOpen { get; set; }
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public bool HasLunchBreak { get; set; }
    public string? LunchStart { get; set; }
    public string? LunchEnd { get; set; }
    public string? Reason { get; set; }
}