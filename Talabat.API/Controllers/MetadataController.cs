using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Talabat.API.Dtos;
using Talabat.API.Errors;
using Talabat.BLL.Interfaces;
using Talabat.DAL.Entities;

namespace Talabat.API.Controllers
{
    [Authorize(Roles = "Admin")]
    public class MetadataController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        public MetadataController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // --- إدارة البراندات (Brands) ---
        [HttpPost("brands")]
        public async Task<ActionResult<ProductBrand>> AddBrand(MetadataDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest(new ApiResponse(400, "Name is required"));

            var brand = new ProductBrand { Name = dto.Name };
            _unitOfWork.Repository<ProductBrand>().Add(brand);
            await _unitOfWork.Complete();
            return Ok(brand);
        }

        [HttpDelete("brands/{id}")]
        public async Task<ActionResult> DeleteBrand(int id)
        {
            var brand = await _unitOfWork.Repository<ProductBrand>().GetByIdAsync(id);
            if (brand == null) return NotFound(new ApiResponse(404));

            _unitOfWork.Repository<ProductBrand>().Delete(brand);
            await _unitOfWork.Complete();
            return Ok();
        }

        // --- إدارة الأنواع (Types) ---
        [HttpPost("types")]
        public async Task<ActionResult<ProductType>> AddType(MetadataDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest(new ApiResponse(400, "Name is required"));

            var type = new ProductType { Name = dto.Name };
            _unitOfWork.Repository<ProductType>().Add(type);
            await _unitOfWork.Complete();
            return Ok(type);
        }

        [HttpDelete("types/{id}")]
        public async Task<ActionResult> DeleteType(int id)
        {
            var type = await _unitOfWork.Repository<ProductType>().GetByIdAsync(id);
            if (type == null) return NotFound(new ApiResponse(404));

            _unitOfWork.Repository<ProductType>().Delete(type);
            await _unitOfWork.Complete();
            return Ok();
        }
    }
}
