using BarberShop.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BarberShop.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<BarberProfile> BarberProfiles => Set<BarberProfile>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<WorkingHour> WorkingHours => Set<WorkingHour>();
    public DbSet<ScheduleBlock> ScheduleBlocks => Set<ScheduleBlock>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<SpecialHour> SpecialHours => Set<SpecialHour>();
    public DbSet<EmailToken> EmailTokens => Set<EmailToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        SetTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void SetTimestamps()
    {
        var now = DateTime.UtcNow;
        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.State == EntityState.Added)
            {
                if (entry.Entity is User u) { u.CreatedAt = now; u.UpdatedAt = now; }
                else if (entry.Entity is BarberProfile bp) { bp.CreatedAt = now; bp.UpdatedAt = now; }
                else if (entry.Entity is Service s) { s.CreatedAt = now; s.UpdatedAt = now; }
                else if (entry.Entity is WorkingHour wh) { wh.CreatedAt = now; wh.UpdatedAt = now; }
                else if (entry.Entity is ScheduleBlock sb) { sb.CreatedAt = now; sb.UpdatedAt = now; }
                else if (entry.Entity is Appointment a) { a.CreatedAt = now; a.UpdatedAt = now; }
                else if (entry.Entity is SpecialHour sh) { sh.CreatedAt = now; sh.UpdatedAt = now; }
                else if (entry.Entity is EmailToken et) { et.CreatedAt = now; }
            }
            else if (entry.State == EntityState.Modified)
            {
                if (entry.Entity is User u) u.UpdatedAt = now;
                else if (entry.Entity is BarberProfile bp) bp.UpdatedAt = now;
                else if (entry.Entity is Service s) s.UpdatedAt = now;
                else if (entry.Entity is WorkingHour wh) wh.UpdatedAt = now;
                else if (entry.Entity is ScheduleBlock sb) sb.UpdatedAt = now;
                else if (entry.Entity is Appointment a) a.UpdatedAt = now;
                else if (entry.Entity is SpecialHour sh) sh.UpdatedAt = now;
            }
        }
    }
}