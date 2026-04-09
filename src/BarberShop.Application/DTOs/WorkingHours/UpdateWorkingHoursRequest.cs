namespace BarberShop.Application.DTOs.WorkingHours;

public class UpdateWorkingHoursRequest
{
    public List<WorkingHourItem> Hours { get; set; } = [];
}

public class WorkingHourItem
{
    public DayOfWeek DayOfWeek { get; set; }
    public bool IsOpen { get; set; }
    public string StartTime { get; set; } = "09:00";
    public string EndTime { get; set; } = "18:00";
    public bool HasLunchBreak { get; set; }
    public string? LunchStart { get; set; }
    public string? LunchEnd { get; set; }
}