using BarberShop.Application.DTOs.WorkingHours;
using BarberShop.Domain.Entities;
using BarberShop.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BarberShop.Application.Services;

public class WorkingHoursService(AppDbContext db)
{
    public async Task<List<WorkingHourResponse>> GetAsync(Guid userId)
    {
        var profile = await db.BarberProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile is null) return [];

        return await db.WorkingHours
            .Where(w => w.BarberProfileId == profile.Id)
            .OrderBy(w => w.DayOfWeek)
            .Select(w => ToResponse(w))
            .ToListAsync();
    }

    public async Task<List<WorkingHourResponse>> UpsertAsync(Guid userId, UpdateWorkingHoursRequest request)
    {
        var profile = await GetProfileAsync(userId);
        var existing = await db.WorkingHours
            .Where(w => w.BarberProfileId == profile.Id)
            .ToListAsync();

        foreach (var item in request.Hours)
        {
            if (!TimeOnly.TryParse(item.StartTime, out var start))
                throw new InvalidOperationException($"Horário de início inválido para {item.DayOfWeek}.");

            if (!TimeOnly.TryParse(item.EndTime, out var end))
                throw new InvalidOperationException($"Horário de fim inválido para {item.DayOfWeek}.");

            if (item.IsOpen && end <= start)
                throw new InvalidOperationException($"Horário de fim deve ser após o início para {item.DayOfWeek}.");

            TimeOnly? lunchStart = null;
            TimeOnly? lunchEnd = null;

            if (item.HasLunchBreak)
            {
                if (!TimeOnly.TryParse(item.LunchStart, out var ls))
                    throw new InvalidOperationException($"Horário de início do almoço inválido para {item.DayOfWeek}.");

                if (!TimeOnly.TryParse(item.LunchEnd, out var le))
                    throw new InvalidOperationException($"Horário de fim do almoço inválido para {item.DayOfWeek}.");

                if (le <= ls)
                    throw new InvalidOperationException($"Fim do almoço deve ser após o início para {item.DayOfWeek}.");

                lunchStart = ls;
                lunchEnd = le;
            }

            var record = existing.FirstOrDefault(w => w.DayOfWeek == item.DayOfWeek);
            if (record is null)
            {
                record = new WorkingHour
                {
                    Id = Guid.NewGuid(),
                    BarberProfileId = profile.Id,
                    DayOfWeek = item.DayOfWeek,
                    IsOpen = item.IsOpen,
                    StartTime = start,
                    EndTime = end,
                    HasLunchBreak = item.HasLunchBreak,
                    LunchStart = lunchStart,
                    LunchEnd = lunchEnd
                };
                db.WorkingHours.Add(record);
            }
            else
            {
                record.IsOpen = item.IsOpen;
                record.StartTime = start;
                record.EndTime = end;
                record.HasLunchBreak = item.HasLunchBreak;
                record.LunchStart = lunchStart;
                record.LunchEnd = lunchEnd;
            }
        }

        await db.SaveChangesAsync();
        return await GetAsync(userId);
    }

    private async Task<BarberProfile> GetProfileAsync(Guid userId)
    {
        return await db.BarberProfiles.FirstOrDefaultAsync(p => p.UserId == userId)
            ?? throw new KeyNotFoundException("Perfil não encontrado.");
    }

    private static WorkingHourResponse ToResponse(WorkingHour w) => new()
    {
        Id = w.Id,
        DayOfWeek = w.DayOfWeek,
        IsOpen = w.IsOpen,
        StartTime = w.StartTime.ToString("HH:mm"),
        EndTime = w.EndTime.ToString("HH:mm"),
        HasLunchBreak = w.HasLunchBreak,
        LunchStart = w.LunchStart?.ToString("HH:mm"),
        LunchEnd = w.LunchEnd?.ToString("HH:mm")
    };
}