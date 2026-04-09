using BarberShop.Domain.Enums;

namespace BarberShop.Domain.Entities;

public class Appointment
{
    public Guid Id { get; set; }
    public Guid BarberProfileId { get; set; }
    public Guid ServiceId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string ClientPhone { get; set; } = string.Empty;
    public DateOnly AppointmentDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public BarberProfile BarberProfile { get; set; } = null!;
    public Service Service { get; set; } = null!;
}