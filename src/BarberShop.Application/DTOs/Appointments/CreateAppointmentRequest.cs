namespace BarberShop.Application.DTOs.Appointments;

public class CreateAppointmentRequest
{
    public Guid ServiceId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string ClientPhone { get; set; } = string.Empty;
    public string AppointmentDate { get; set; } = string.Empty;
    public string StartTime { get; set; } = string.Empty;
}