using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Talabat.DAL.Entities.Identity;

namespace Talabat.DAL.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            if (!await roleManager.RoleExistsAsync("Admin"))
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
            }
            if (!await roleManager.RoleExistsAsync("User"))
            {
                await roleManager.CreateAsync(new IdentityRole("User"));
            }

            if (await userManager.FindByEmailAsync("saifahmedelbattawy@gmail.com") == null)
            {
                var user = new AppUser()
                {
                    DisplayName = "Saif Ahmed",
                    UserName = "saifahmedelbattawy@gmail.com",
                    Email = "saifahmedelbattawy@gmail.com",
                    PhoneNumber = "01012193611",
                    Address = new Address()
                    {
                        FirstName = "Saif",
                        LastName = "Ahmed",
                        Country = "Egypt",
                        City = "Giza",
                        Street = "Giza St",
                        ZipCode = "12345",
                        PhoneNumber = "01012193611",
                        WhatsAppNumber = "01012193611"
                    }
                };
                await userManager.CreateAsync(user, "01012193611");
                await userManager.AddToRoleAsync(user, "Admin");
            }

            var seededUser = await userManager.FindByEmailAsync("saifahmedelattawy@gmail.com");
            if (seededUser != null && !await userManager.IsInRoleAsync(seededUser, "Admin"))
            {
                await userManager.AddToRoleAsync(seededUser, "Admin");
            }
        }
    }
}
