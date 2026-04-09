namespace BarberShop.Application.DTOs.Profile;

public class UpdateProfileRequest
{
    public string DisplayName { get; set; } = string.Empty;
    public string BusinessName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
}