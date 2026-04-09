namespace BarberShop.Application.DTOs.WorkingHours;

public class WorkingHourResponse
{
    public Guid Id { get; set; }
    public DayOfWeek DayOfWeek { get; set; }
    public bool IsOpen { get; set; }
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public bool HasLunchBreak { get; set; }
    public string? LunchStart { get; set; }
    public string? LunchEnd { get; set; }
}