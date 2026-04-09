namespace BarberShop.Domain.Entities;

public class WorkingHour
{
    public Guid Id { get; set; }
    public Guid BarberProfileId { get; set; }
    public DayOfWeek DayOfWeek { get; set; }
    public bool IsOpen { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public bool HasLunchBreak { get; set; }
    public TimeOnly? LunchStart { get; set; }
    public TimeOnly? LunchEnd { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public BarberProfile BarberProfile { get; set; } = null!;
}