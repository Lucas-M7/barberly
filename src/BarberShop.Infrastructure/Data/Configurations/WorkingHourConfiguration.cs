using BarberShop.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BarberShop.Infrastructure.Data.Configurations;

public class WorkingHourConfiguration : IEntityTypeConfiguration<WorkingHour>
{
    public void Configure(EntityTypeBuilder<WorkingHour> builder)
    {
        builder.ToTable("working_hours");
        builder.HasKey(w => w.Id);
        builder.Property(w => w.Id).HasColumnName("id").HasDefaultValueSql("gen_random_uuid()");
        builder.Property(w => w.BarberProfileId).HasColumnName("barber_profile_id");
        builder.Property(w => w.DayOfWeek).HasColumnName("day_of_week").IsRequired();
        builder.Property(w => w.IsOpen).HasColumnName("is_open").HasDefaultValue(false);
        builder.Property(w => w.StartTime).HasColumnName("start_time").HasColumnType("time");
        builder.Property(w => w.EndTime).HasColumnName("end_time").HasColumnType("time");
        builder.Property(w => w.HasLunchBreak).HasColumnName("has_lunch_break").HasDefaultValue(false);
        builder.Property(w => w.LunchStart).HasColumnName("lunch_start").HasColumnType("time");
        builder.Property(w => w.LunchEnd).HasColumnName("lunch_end").HasColumnType("time");
        builder.Property(w => w.CreatedAt).HasColumnName("created_at");
        builder.Property(w => w.UpdatedAt).HasColumnName("updated_at");

        builder.HasOne(w => w.BarberProfile)
               .WithMany(b => b.WorkingHours)
               .HasForeignKey(w => w.BarberProfileId);
    }
}