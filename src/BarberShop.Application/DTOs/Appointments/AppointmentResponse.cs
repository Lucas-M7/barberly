namespace BarberShop.Application.DTOs.Appointments;

public class AppointmentResponse
{
    public Guid Id { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string ClientPhone { get; set; } = string.Empty;
    public string ServiceName { get; set; } = string.Empty;
    public int ServiceDuration { get; set; }
    public decimal? ServicePrice { get; set; }
    public string AppointmentDate { get; set; } = string.Empty;
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}