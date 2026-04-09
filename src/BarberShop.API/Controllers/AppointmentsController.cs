using BarberShop.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarberShop.API.Controllers;

[Authorize]
public class AppointmentsController(AppointmentService appointmentService) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? date)
    {
        DateOnly? parsedDate = null;

        if (!string.IsNullOrWhiteSpace(date))
        {
            if (!DateOnly.TryParse(date, out var d))
                return BadRequest(new { error = "Data inválida. Use o formato YYYY-MM-DD." });

            parsedDate = d;
        }

        var result = await appointmentService.GetAsync(GetUserId(), parsedDate);
        return Ok(result);
    }

    [HttpPatch("{id:guid}/cancel")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        var result = await appointmentService.CancelAsync(GetUserId(), id);
        return Ok(result);
    }

    [HttpPatch("{id:guid}/complete")]
    public async Task<IActionResult> Complete(Guid id)
    {
        var result = await appointmentService.CompleteAsync(GetUserId(), id);
        return Ok(result);
    }
}