using BarberShop.Application.DTOs.Profile;
using BarberShop.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarberShop.API.Controllers;

[Authorize]
public class ProfileController(ProfileService profileService) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var result = await profileService.GetAsync(GetUserId());
        return Ok(result);
    }

    [HttpPut]
    public async Task<IActionResult> Upsert([FromBody] UpdateProfileRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.DisplayName))
            return BadRequest(new { error = "Nome de exibição é obrigatório." });

        if (string.IsNullOrWhiteSpace(request.BusinessName))
            return BadRequest(new { error = "Nome do negócio é obrigatório." });

        if (string.IsNullOrWhiteSpace(request.Slug))
            return BadRequest(new { error = "Slug é obrigatório." });

        if (!System.Text.RegularExpressions.Regex.IsMatch(request.Slug, @"^[a-z0-9\-]+$"))
            return BadRequest(new { error = "Slug deve conter apenas letras minúsculas, números e hífens." });

        var result = await profileService.UpsertAsync(GetUserId(), request);
        return Ok(result);
    }
}