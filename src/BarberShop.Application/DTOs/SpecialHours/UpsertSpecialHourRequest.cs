namespace BarberShop.Application.DTOs.SpecialHours;

public class UpsertSpecialHourRequest
{
    public string Date { get; set; } = string.Empty;
    public bool IsOpen { get; set; }
    public string StartTime { get; set; } = "09:00";
    public string EndTime { get; set; } = "18:00";
    public bool HasLunchBreak { get; set; }
    public string? LunchStart { get; set; }
    public string? LunchEnd { get; set; }
    public string? Reason { get; set; }
}