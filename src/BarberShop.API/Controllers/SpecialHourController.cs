using BarberShop.Application.DTOs.SpecialHours;
using BarberShop.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarberShop.API.Controllers;

[Authorize]
public class SpecialHoursController(SpecialHoursService specialHoursService) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await specialHoursService.GetAsync(GetUserId());
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Upsert([FromBody] UpsertSpecialHourRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Date))
            return BadRequest(new { error = "Data é obrigatória." });

        var result = await specialHoursService.UpsertAsync(GetUserId(), request);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await specialHoursService.DeleteAsync(GetUserId(), id);
        return NoContent();
    }
}