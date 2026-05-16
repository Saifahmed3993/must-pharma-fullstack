using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Talabat.API.Dtos;
using Talabat.API.Errors;
using Talabat.API.Helpers;
using Talabat.BLL.Interfaces;
using Talabat.BLL.Specifications;
using System.Linq;
using Talabat.DAL.Entities;

namespace Talabat.API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IGenericRepository<ProductBrand> _productBrandsRepo;
        private readonly IGenericRepository<ProductType> _productTypesRepo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IResponseCacheService _responseCacheService;

        public ProductsController(IGenericRepository<Product> productsRepo, 
            IGenericRepository<ProductBrand> productBrandRepo, IGenericRepository<ProductType> productTypesRepo,
            IMapper mapper, IUnitOfWork unitOfWork, IResponseCacheService responseCacheService)
        {
            _productsRepo = productsRepo;
            _productBrandsRepo = productBrandRepo;
            _productTypesRepo = productTypesRepo;
            _mapper = mapper;   
            _unitOfWork = unitOfWork;
            _responseCacheService = responseCacheService;
        }

        // POST: api/products
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<ProductToReturnDto>> CreateProduct([FromForm] ProductCreateDto productDto)
        {
            if (productDto.PictureUrl == null || productDto.PictureUrl.Count == 0)
                return BadRequest(new ApiResponse(400, "At least one image is required"));

            var pictureUrl = DocumentSettings.UploadFile(productDto.PictureUrl[0], "products");
            var product = _mapper.Map<ProductCreateDto, Product>(productDto);
            product.PictureUrl = pictureUrl;

            _productsRepo.Add(product);
            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem Occurred with Creating The Product"));

            // تفريغ كاش المنتجات عشان المنتج الجديد يظهر فوراً
            await _responseCacheService.RemoveCacheByPatternAsync("/api/products");

            return Ok(_mapper.Map<Product, ProductToReturnDto>(product));
        }

        // GET: api/products
        [CachedAttribute(600)]
        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts([FromQuery] ProductSpecParams productParams)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(productParams);
            var countSpec = new ProductWithFiltersForCountSpecification(productParams);

            var totalItems = await _productsRepo.GetCountAsync(countSpec);
            var products = await _productsRepo.GetAllWithSpecAsync(spec);
            
            var data = _mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products);

            return Ok(new Pagination<ProductToReturnDto>(productParams.PageIndex, productParams.PageSize, totalItems, data));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<ProductToReturnDto>> UpdateProduct(int id, [FromForm] ProductCreateDto productDto)
        {
            var product = await _productsRepo.GetByIdAsync(id);
            if (product == null) return NotFound(new ApiResponse(404));

            if (productDto.PictureUrl != null && productDto.PictureUrl.Count > 0)
            {
                // مسح الصورة القديمة من السيرفر
                DocumentSettings.DeleteFile(product.PictureUrl, "products");
                // رفع الجديدة
                product.PictureUrl = DocumentSettings.UploadFile(productDto.PictureUrl[0], "products");
            }

            product.Name = productDto.Name;
            product.Description = productDto.Description;
            product.Price = productDto.Price;
            product.ProductBrandId = productDto.ProductBrandId;
            product.ProductTypeId = productDto.ProductTypeId;
            product.ActiveIngredient = productDto.ActiveIngredient;
            product.DiscountPercentage = productDto.DiscountPercentage;
            product.Flavor = productDto.Flavor;
            product.Size = productDto.Size;

            _productsRepo.Update(product);
            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem Occurred with Updating The Product"));

            // تفريغ الكاش
            await _responseCacheService.RemoveCacheByPatternAsync("/api/products");

            return Ok(_mapper.Map<Product, ProductToReturnDto>(product));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _productsRepo.GetByIdAsync(id);
            if (product == null) return NotFound(new ApiResponse(404));

            // مسح الصورة من السيرفر
            DocumentSettings.DeleteFile(product.PictureUrl, "products");

            _productsRepo.Delete(product);
            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem Occurred with Deleting The Product"));

            // تفريغ الكاش
            await _responseCacheService.RemoveCacheByPatternAsync("/api/products");

            return Ok(new { message = "Product deleted successfully" });
        }

        [CachedAttribute(600)]
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(id);

            var product = await _productsRepo.GetEntityWithSpec(spec);
            if (product == null) return NotFound(new ApiResponse(404));

            return Ok(_mapper.Map<Product, ProductToReturnDto>(product));
        }

        [CachedAttribute(600)]
        [HttpGet("bundles")]
        public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> GetBundles()
        {
            var spec = new ProductsWithTypesAndBrandsSpecification();
            var products = await _productsRepo.GetAllWithSpecAsync(spec);
            
            var bundles = products.Where(p => p.ProductType != null && p.ProductType.Name.ToLower().Contains("bundle")).ToList();
            
            var data = _mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(bundles);
            return Ok(data);
        }

        // [CachedAttribute(600)]
        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetBrands()
        {
            return Ok(await _productBrandsRepo.GetAllAsync());
        }

        // [CachedAttribute(600)]
        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetTypes()
        {
            return Ok(await _productTypesRepo.GetAllAsync());
        }
        // POST: api/products/brands
        [Authorize(Roles = "Admin")]
        [HttpPost("brands")]
        public async Task<ActionResult<ProductBrand>> CreateBrand([FromBody] ProductBrand brand)
        {
            _productBrandsRepo.Add(brand);
            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem occurred adding brand"));

            // تفريغ الكاش
            await _responseCacheService.RemoveCacheByPatternAsync("/api/products");

            return Ok(brand);
        }

        // POST: api/products/types
        [Authorize(Roles = "Admin")]
        [HttpPost("types")]
        public async Task<ActionResult<ProductType>> CreateType([FromBody] ProductType type)
        {
            _productTypesRepo.Add(type);
            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem occurred adding type"));

            // تفريغ الكاش
            await _responseCacheService.RemoveCacheByPatternAsync("/api/products");

            return Ok(type);
        }
    }
}