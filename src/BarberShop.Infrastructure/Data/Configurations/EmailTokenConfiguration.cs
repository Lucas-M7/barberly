using BarberShop.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BarberShop.Infrastructure.Data.Configurations;

public class EmailTokenConfiguration : IEntityTypeConfiguration<EmailToken>
{
    public void Configure(EntityTypeBuilder<EmailToken> builder)
    {
        builder.ToTable("email_tokens");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id").HasDefaultValueSql("gen_random_uuid()");
        builder.Property(e => e.UserId).HasColumnName("user_id");
        builder.Property(e => e.Token).HasColumnName("token").HasMaxLength(100).IsRequired();
        builder.Property(e => e.Type).HasColumnName("type").HasConversion<int>();
        builder.Property(e => e.ExpiresAt).HasColumnName("expires_at");
        builder.Property(e => e.UsedAt).HasColumnName("used_at");
        builder.Property(e => e.CreatedAt).HasColumnName("created_at");

        builder.HasIndex(e => e.Token).IsUnique();

        builder.HasOne(e => e.User)
               .WithMany(u => u.EmailTokens)
               .HasForeignKey(e => e.UserId);
    }
}