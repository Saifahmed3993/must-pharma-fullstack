using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Talabat.API.Dtos
{
    public class ProductCreateDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        [Range(0.1, double.MaxValue, ErrorMessage = "Price must be greater than zero")]
        public decimal Price { get; set; }

        [Required]
        public int ProductBrandId { get; set; }

        [Required]
        public int ProductTypeId { get; set; }

        public decimal DiscountPercentage { get; set; }

        public string ActiveIngredient { get; set; }

        public string Flavor { get; set; }

        [Required]
        public string Size { get; set; }

        [Required]
        public List<IFormFile> PictureUrl { get; set; }
    }
}
