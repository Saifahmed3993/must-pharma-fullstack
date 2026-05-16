using Microsoft.AspNetCore.Http;

namespace Talabat.API.Dtos
{
    public class UserUpdateDto
    {
        public string DisplayName { get; set; }
        public string PhoneNumber { get; set; }
        public IFormFile Image { get; set; }
    }
}
