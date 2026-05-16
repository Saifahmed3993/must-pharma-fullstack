using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Talabat.API.Dtos;
using Talabat.API.Errors;
using Talabat.API.Extensions;
using Talabat.BLL.Interfaces;
using Talabat.DAL.Entities.Identity;

namespace Talabat.API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AccountController(UserManager<AppUser> userManager, 
            SignInManager<AppUser> signInManager, 
            ITokenService tokenService, 
            IMapper mapper)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if(user == null) return Unauthorized(new ApiResponse(401));
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if(!result.Succeeded) return Unauthorized(new ApiResponse(401));
            
            var roles = await _userManager.GetRolesAsync(user);
            
            var userDto = new UserDto()
            {
                Email = loginDto.Email,
                DisplayName = $"{user.DisplayName}",
                Token = await _tokenService.CreateToken(user, _userManager),
                Role = roles.FirstOrDefault() ?? "User",
                Image = user.PictureUrl
            };
            return Ok(userDto);
        }
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if(CheckEmailExistsAsync(registerDto.Email).Result.Value)
                return new BadRequestObjectResult(new ApiValidationErrorResponse() { Errors = new[] { "Email Address already is in Use !!" } });
            var user = new AppUser()
            {
                Email = registerDto.Email,
                UserName = registerDto.Email.Split("@")[0],
                DisplayName = registerDto.DisplayName,
                PhoneNumber = registerDto.PhoneNumber,
                Address = new Address()
                {
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    City = registerDto.City,
                    Country = registerDto.Country,
                    Street = registerDto.Street,
                    ZipCode = registerDto.ZipCode
                }
            };
            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded) return BadRequest(new ApiResponse(400));
            
            // إضافة دور "User" بشكل افتراضي عند التسجيل
            await _userManager.AddToRoleAsync(user, "User");

            var userDto = new UserDto()
            {
                Email = registerDto.Email,
                DisplayName = $"{user.DisplayName}",
                Token = await _tokenService.CreateToken(user, _userManager),
                Role = "User",
                Image = user.PictureUrl
            };
            return Ok(userDto);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = await _userManager.FindByEmailAsync(email);
            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new UserDto()
            {
                Email = user.Email,
                DisplayName = $"{user.DisplayName}",
                Token = await _tokenService.CreateToken(user, _userManager),
                Role = roles.FirstOrDefault() ?? "User",
                Image = user.PictureUrl
            });
        }
        [HttpGet("emailexists")]
        public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email)
        {
            return await _userManager.FindByEmailAsync(email) != null;
        }

        [Authorize]
        [HttpGet("address")]
        public async Task<ActionResult<AddressDto>> GetUserAddress()
        {
            var user = await _userManager.FindByEmailWithAddressAsync(User);
            return Ok(_mapper.Map<Address, AddressDto>(user.Address));
        }

        [Authorize]
        [HttpPut("address")]
        public async Task<ActionResult<AddressDto>> UpdateUserAddress(AddressDto address)
        {
            var user = await _userManager.FindByEmailWithAddressAsync(User);
            user.Address =  _mapper.Map<AddressDto, Address>(address);

            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded) return Ok(_mapper.Map<Address, AddressDto>(user.Address));
            return BadRequest(new ApiResponse(400, "A Problem occured With Updating User Address"));
        }

        [Authorize]
        [HttpPut("update")]
        public async Task<ActionResult<UserDto>> UpdateUser([FromForm] UserUpdateDto updateDto)
        {
            try
            {
                var email = User.FindFirstValue(ClaimTypes.Email);
                var user = await _userManager.FindByEmailAsync(email);
                if (user == null) return NotFound(new ApiResponse(404));

                if (!string.IsNullOrEmpty(updateDto.DisplayName))
                {
                    user.DisplayName = updateDto.DisplayName;
                }
                if (!string.IsNullOrEmpty(updateDto.PhoneNumber))
                {
                    user.PhoneNumber = updateDto.PhoneNumber;
                }

                if (updateDto.Image != null && updateDto.Image.Length > 0)
                {
                    if (!string.IsNullOrEmpty(user.PictureUrl))
                    {
                        Helpers.DocumentSettings.DeleteFile(user.PictureUrl, "users");
                    }
                    user.PictureUrl = Helpers.DocumentSettings.UploadFile(updateDto.Image, "users");
                }

                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded) return BadRequest(new ApiResponse(400, "Failed to update profile"));

                var roles = await _userManager.GetRolesAsync(user);

                return Ok(new UserDto()
                {
                    Email = user.Email,
                    DisplayName = user.DisplayName,
                    Token = await _tokenService.CreateToken(user, _userManager),
                    Role = roles.FirstOrDefault() ?? "User",
                    Image = user.PictureUrl
                });
            }
            catch (System.Exception ex)
            {
                System.Console.WriteLine("======================= UPDATE USER EXCEPTION =======================");
                System.Console.WriteLine(ex.ToString());
                System.Console.WriteLine("=====================================================================");
                return StatusCode(500, new { message = ex.Message, details = ex.ToString() });
            }
        }
    }
}
