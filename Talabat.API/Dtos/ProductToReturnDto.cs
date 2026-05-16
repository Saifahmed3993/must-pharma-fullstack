namespace Talabat.API.Dtos
{
    public class ProductToReturnDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string PictureUrl { get; set; }
        public decimal DiscountPercentage { get; set; }
        public string ActiveIngredient { get; set; }
        public string Flavor { get; set; }
        public string Size { get; set; }
        public string ProductType { get; set; }
        public string ProductBrand { get; set; }
    }
}
