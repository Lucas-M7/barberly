namespace BarberShop.Domain.Entities;

public class ScheduleBlock
{
    public Guid Id { get; set; }
    public Guid BarberProfileId { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string? Reason { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public BarberProfile BarberProfile { get; set; } = null!;
}