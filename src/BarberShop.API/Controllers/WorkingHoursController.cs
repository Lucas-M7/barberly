using BarberShop.Application.DTOs.WorkingHours;
using BarberShop.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarberShop.API.Controllers;

[Authorize]
public class WorkingHoursController(WorkingHoursService workingHoursService) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var result = await workingHoursService.GetAsync(GetUserId());
        return Ok(result);
    }

    [HttpPut]
    public async Task<IActionResult> Upsert([FromBody] UpdateWorkingHoursRequest request)
    {
        if (request.Hours is null || request.Hours.Count == 0)
            return BadRequest(new { error = "Nenhum horário informado." });

        var result = await workingHoursService.UpsertAsync(GetUserId(), request);
        return Ok(result);
    }
}