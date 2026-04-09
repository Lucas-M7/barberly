using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace BarberShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseController : ControllerBase
{
    protected Guid GetUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("Token inválido.");

        return Guid.Parse(claim);
    }
}