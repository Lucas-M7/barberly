using BarberShop.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BarberShop.Infrastructure.Data.Configurations;

public class ScheduleBlockConfiguration : IEntityTypeConfiguration<ScheduleBlock>
{
    public void Configure(EntityTypeBuilder<ScheduleBlock> builder)
    {
        builder.ToTable("schedule_blocks");
        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id).HasColumnName("id").HasDefaultValueSql("gen_random_uuid()");
        builder.Property(s => s.BarberProfileId).HasColumnName("barber_profile_id");
        builder.Property(s => s.StartDate).HasColumnName("start_date").HasColumnType("date");
        builder.Property(s => s.EndDate).HasColumnName("end_date").HasColumnType("date");
        builder.Property(s => s.Reason).HasColumnName("reason").HasMaxLength(255);
        builder.Property(s => s.CreatedAt).HasColumnName("created_at");
        builder.Property(s => s.UpdatedAt).HasColumnName("updated_at");

        builder.HasOne(s => s.BarberProfile)
               .WithMany(b => b.ScheduleBlocks)
               .HasForeignKey(s => s.BarberProfileId);
    }
}