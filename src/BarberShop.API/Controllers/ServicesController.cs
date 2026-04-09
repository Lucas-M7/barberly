using BarberShop.Application.DTOs.Services;
using BarberShop.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarberShop.API.Controllers;

[Authorize]
public class ServicesController(ServiceService serviceService) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await serviceService.GetAllAsync(GetUserId());
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateServiceRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { error = "Nome do serviço é obrigatório." });

        if (request.DurationMinutes <= 0)
            return BadRequest(new { error = "Duração deve ser maior que zero." });

        var result = await serviceService.CreateAsync(GetUserId(), request);
        return Created(string.Empty, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateServiceRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { error = "Nome do serviço é obrigatório." });

        if (request.DurationMinutes <= 0)
            return BadRequest(new { error = "Duração deve ser maior que zero." });

        var result = await serviceService.UpdateAsync(GetUserId(), id, request);
        return Ok(result);
    }

    [HttpPatch("{id:guid}/toggle")]
    public async Task<IActionResult> Toggle(Guid id)
    {
        var result = await serviceService.ToggleAsync(GetUserId(), id);
        return Ok(result);
    }
}