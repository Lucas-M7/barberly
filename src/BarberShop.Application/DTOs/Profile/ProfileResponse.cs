namespace BarberShop.Application.DTOs.Profile;

public class ProfileResponse
{
    public Guid Id { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string BusinessName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
}