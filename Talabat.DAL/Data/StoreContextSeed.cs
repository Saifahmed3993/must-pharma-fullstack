using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Talabat.DAL.Entities;
using Talabat.DAL.Entities.Order;

namespace Talabat.DAL.Data
{
    public class StoreContextSeed
    {
        public static async Task SeedAsync(StoreContext context, ILoggerFactory loggerFactory)
        {
            try
            {
                // Try multiple paths: Docker publish output first, then local dev relative path
                string GetSeedFilePath(string fileName)
                {
                    // Path 1: Published output (Docker) - SeedData folder in app directory
                    var publishPath = Path.Combine(AppContext.BaseDirectory, "SeedData", fileName);
                    if (File.Exists(publishPath)) return publishPath;

                    // Path 2: Local development - relative to project directory
                    var devPath = Path.Combine("..", "Talabat.DAL", "Data", "SeedData", fileName);
                    if (File.Exists(devPath)) return devPath;

                    // Fallback: try current directory
                    var fallbackPath = Path.Combine(Directory.GetCurrentDirectory(), "SeedData", fileName);
                    return fallbackPath;
                }

                if (!context.ProductBrands.Any())
                {
                    var brandsData = File.ReadAllText(GetSeedFilePath("brands.json"));
                    var brands = JsonSerializer.Deserialize<List<ProductBrand>>(brandsData);
                    foreach (var brand in brands)
                    {
                        brand.Id = 0; // تصفير الـ Id
                        context.ProductBrands.Add(brand);
                    }

                    await context.SaveChangesAsync();
                }

                if (!context.ProductTypes.Any())
                {
                    var typesData = File.ReadAllText(GetSeedFilePath("types.json"));
                    var types = JsonSerializer.Deserialize<List<ProductType>>(typesData);
                    foreach (var item in types)
                    {
                        item.Id = 0; // تصفير الـ Id
                        context.ProductTypes.Add(item);
                    }

                    await context.SaveChangesAsync();
                }

                if (!context.Products.Any())
                {
                    var productsData = File.ReadAllText(GetSeedFilePath("products.json"));
                    var products = JsonSerializer.Deserialize<List<Product>>(productsData);
                    foreach (var item in products)
                    {
                        item.Id = 0; // تصفير الـ Id
                        context.Products.Add(item);
                    }

                    await context.SaveChangesAsync();
                }

                if (!context.DeliveryMethods.Any())
                {
                    var deliverMethodsData = File.ReadAllText(GetSeedFilePath("delivery.json"));
                    var deliverMethods = JsonSerializer.Deserialize<List<DeliveryMethod>>(deliverMethodsData);
                    foreach (var deliverMethod in deliverMethods)
                    {
                        deliverMethod.Id = 0; // تصفير الـ Id
                        context.DeliveryMethods.Add(deliverMethod);
                    }

                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<StoreContextSeed>();
                logger.LogError(ex.Message);
            }
        }
    }
}