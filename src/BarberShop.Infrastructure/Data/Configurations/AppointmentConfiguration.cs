using BarberShop.Domain.Entities;
using BarberShop.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BarberShop.Infrastructure.Data.Configurations;

public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
{
    public void Configure(EntityTypeBuilder<Appointment> builder)
    {
        builder.ToTable("appointments");
        builder.HasKey(a => a.Id);
        builder.Property(a => a.Id).HasColumnName("id").HasDefaultValueSql("gen_random_uuid()");
        builder.Property(a => a.BarberProfileId).HasColumnName("barber_profile_id");
        builder.Property(a => a.ServiceId).HasColumnName("service_id");
        builder.Property(a => a.ClientName).HasColumnName("client_name").HasMaxLength(100).IsRequired();
        builder.Property(a => a.ClientPhone).HasColumnName("client_phone").HasMaxLength(20).IsRequired();
        builder.Property(a => a.AppointmentDate).HasColumnName("appointment_date").HasColumnType("date");
        builder.Property(a => a.StartTime).HasColumnName("start_time").HasColumnType("time");
        builder.Property(a => a.EndTime).HasColumnName("end_time").HasColumnType("time");
        builder.Property(a => a.Status).HasColumnName("status")
               .HasDefaultValue(AppointmentStatus.Scheduled)
               .HasConversion<int>();
        builder.Property(a => a.CreatedAt).HasColumnName("created_at");
        builder.Property(a => a.UpdatedAt).HasColumnName("updated_at");

        builder.HasOne(a => a.BarberProfile)
               .WithMany(b => b.Appointments)
               .HasForeignKey(a => a.BarberProfileId);

        builder.HasOne(a => a.Service)
               .WithMany()
               .HasForeignKey(a => a.ServiceId);
    }
}