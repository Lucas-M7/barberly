using BarberShop.Application.DTOs.SpecialHours;
using BarberShop.Domain.Entities;
using BarberShop.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BarberShop.Application.Services;

public class SpecialHoursService(AppDbContext db)
{
    public async Task<List<SpecialHourResponse>> GetAsync(Guid userId)
    {
        var profile = await db.BarberProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile is null) return [];

        return await db.SpecialHours
            .Where(s => s.BarberProfileId == profile.Id)
            .OrderBy(s => s.Date)
            .Select(s => ToResponse(s))
            .ToListAsync();
    }

    public async Task<SpecialHourResponse> UpsertAsync(Guid userId, UpsertSpecialHourRequest request)
    {
        if (!DateOnly.TryParse(request.Date, out var date))
            throw new InvalidOperationException("Data inválida.");

        if (!TimeOnly.TryParse(request.StartTime, out var start))
            throw new InvalidOperationException("Horário de início inválido.");

        if (!TimeOnly.TryParse(request.EndTime, out var end))
            throw new InvalidOperationException("Horário de fim inválido.");

        if (request.IsOpen && end <= start)
            throw new InvalidOperationException("Horário de fim deve ser após o início.");

        TimeOnly? lunchStart = null;
        TimeOnly? lunchEnd = null;

        if (request.HasLunchBreak)
        {
            if (!TimeOnly.TryParse(request.LunchStart, out var ls))
                throw new InvalidOperationException("Horário de início do almoço inválido.");

            if (!TimeOnly.TryParse(request.LunchEnd, out var le))
                throw new InvalidOperationException("Horário de fim do almoço inválido.");

            lunchStart = ls;
            lunchEnd = le;
        }

        var profile = await db.BarberProfiles.FirstOrDefaultAsync(p => p.UserId == userId)
            ?? throw new KeyNotFoundException("Perfil não encontrado.");

        var existing = await db.SpecialHours
            .FirstOrDefaultAsync(s => s.BarberProfileId == profile.Id && s.Date == date);

        if (existing is null)
        {
            existing = new SpecialHour
            {
                Id = Guid.NewGuid(),
                BarberProfileId = profile.Id,
                Date = date,
                IsOpen = request.IsOpen,
                StartTime = start,
                EndTime = end,
                HasLunchBreak = request.HasLunchBreak,
                LunchStart = lunchStart,
                LunchEnd = lunchEnd,
                Reason = request.Reason?.Trim()
            };
            db.SpecialHours.Add(existing);
        }
        else
        {
            existing.IsOpen = request.IsOpen;
            existing.StartTime = start;
            existing.EndTime = end;
            existing.HasLunchBreak = request.HasLunchBreak;
            existing.LunchStart = lunchStart;
            existing.LunchEnd = lunchEnd;
            existing.Reason = request.Reason?.Trim();
        }

        await db.SaveChangesAsync();
        return ToResponse(existing);
    }

    public async Task DeleteAsync(Guid userId, Guid id)
    {
        var profile = await db.BarberProfiles.FirstOrDefaultAsync(p => p.UserId == userId)
            ?? throw new KeyNotFoundException("Perfil não encontrado.");

        var record = await db.SpecialHours
            .FirstOrDefaultAsync(s => s.Id == id && s.BarberProfileId == profile.Id)
            ?? throw new KeyNotFoundException("Horário especial não encontrado.");

        db.SpecialHours.Remove(record);
        await db.SaveChangesAsync();
    }

    private static SpecialHourResponse ToResponse(SpecialHour s) => new()
    {
        Id = s.Id,
        Date = s.Date.ToString("yyyy-MM-dd"),
        IsOpen = s.IsOpen,
        StartTime = s.StartTime.ToString("HH:mm"),
        EndTime = s.EndTime.ToString("HH:mm"),
        HasLunchBreak = s.HasLunchBreak,
        LunchStart = s.LunchStart?.ToString("HH:mm"),
        LunchEnd = s.LunchEnd?.ToString("HH:mm"),
        Reason = s.Reason
    };
}