using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendService.Models
{
    public class User
    {
        [Key]
        [Column("uuid")]
        public Guid Uuid { get; set; }

        [Required]
        [Column("first_name")]
        public string FirstName { get; set; }

        [Required]
        [Column("last_name")]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        [Column("email")]
        public string Email { get; set; }

        [Column("phone")]
        public string Phone { get; set; }

        [Column("thumbnail_picture")]
        public string ThumbnailPicture { get; set; }

        [Column("large_picture")]
        public string LargePicture { get; set; }

        [Column("street_number")]
        public string StreetNumber { get; set; }

        [Column("street_name")]
        public string StreetName { get; set; }

        [Column("city")]
        public string City { get; set; }

        [Column("state")]
        public string State { get; set; }

        [Column("country")]
        public string Country { get; set; }

        [Column("postcode")]
        public string Postcode { get; set; }
    }
}