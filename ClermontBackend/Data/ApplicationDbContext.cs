using Microsoft.EntityFrameworkCore;
using BackendService.Models;

namespace BackendService.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.HasKey(e => e.Uuid);

                entity.Property(e => e.Uuid)
                    .HasColumnName("uuid")
                    .IsRequired();

                entity.Property(e => e.FirstName)
                    .HasColumnName("first_name")
                    .IsRequired();

                entity.Property(e => e.LastName)
                    .HasColumnName("last_name")
                    .IsRequired();

                entity.Property(e => e.Email)
                    .HasColumnName("email")
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Phone)
                    .HasColumnName("phone")
                    .HasMaxLength(20);

                entity.Property(e => e.ThumbnailPicture)
                    .HasColumnName("thumbnail_picture")
                    .HasMaxLength(255);

                entity.Property(e => e.LargePicture)
                    .HasColumnName("large_picture")
                    .HasMaxLength(255);

                entity.Property(e => e.StreetNumber)
                    .HasColumnName("street_number")
                    .HasMaxLength(10);

                entity.Property(e => e.StreetName)
                    .HasColumnName("street_name")
                    .HasMaxLength(100);

                entity.Property(e => e.City)
                    .HasColumnName("city")
                    .HasMaxLength(100);

                entity.Property(e => e.State)
                    .HasColumnName("state")
                    .HasMaxLength(100);

                entity.Property(e => e.Country)
                    .HasColumnName("country")
                    .HasMaxLength(100);

                entity.Property(e => e.Postcode)
                    .HasColumnName("postcode")
                    .HasMaxLength(20);
            });
        }
    }
}