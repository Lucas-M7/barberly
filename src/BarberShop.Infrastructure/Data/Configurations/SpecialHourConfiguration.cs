using BarberShop.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BarberShop.Infrastructure.Data.Configurations;

public class SpecialHourConfiguration : IEntityTypeConfiguration<SpecialHour>
{
    public void Configure(EntityTypeBuilder<SpecialHour> builder)
    {
        builder.ToTable("special_hours");
        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id).HasColumnName("id").HasDefaultValueSql("gen_random_uuid()");
        builder.Property(s => s.BarberProfileId).HasColumnName("barber_profile_id");
        builder.Property(s => s.Date).HasColumnName("date").HasColumnType("date");
        builder.Property(s => s.IsOpen).HasColumnName("is_open").HasDefaultValue(true);
        builder.Property(s => s.StartTime).HasColumnName("start_time").HasColumnType("time");
        builder.Property(s => s.EndTime).HasColumnName("end_time").HasColumnType("time");
        builder.Property(s => s.HasLunchBreak).HasColumnName("has_lunch_break").HasDefaultValue(false);
        builder.Property(s => s.LunchStart).HasColumnName("lunch_start").HasColumnType("time");
        builder.Property(s => s.LunchEnd).HasColumnName("lunch_end").HasColumnType("time");
        builder.Property(s => s.Reason).HasColumnName("reason").HasMaxLength(255);
        builder.Property(s => s.CreatedAt).HasColumnName("created_at");
        builder.Property(s => s.UpdatedAt).HasColumnName("updated_at");

        builder.HasIndex(s => new { s.BarberProfileId, s.Date }).IsUnique();

        builder.HasOne(s => s.BarberProfile)
               .WithMany(b => b.SpecialHours)
               .HasForeignKey(s => s.BarberProfileId);
    }
}