using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Talabat.BLL.Interfaces;
using Talabat.BLL.Repositories;

namespace Talabat.BLL.Services
{
    public class ResponseCacheService: IResponseCacheService
    {
        private readonly IDatabase _database;
        private readonly IConnectionMultiplexer _redis;
        public ResponseCacheService(IConnectionMultiplexer redis)
        {
            _redis = redis;
            _database = redis.GetDatabase();
        }

        public async Task CacheResponseAsync(string cacheKey, object response, TimeSpan timeToLive)
        {
            if (response == null) return;

            var options = new JsonSerializerOptions() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            var serializedResponse = JsonSerializer.Serialize(response, options);

            await _database.StringSetAsync(cacheKey, serializedResponse, timeToLive);
        }

        public async Task<string> GetCachedResponse(string cacheKey)
        {
            var cachedResponse = await _database.StringGetAsync(cacheKey);
            if (cachedResponse.IsNullOrEmpty) return null;
            return cachedResponse;
        }

        public async Task RemoveCacheByPatternAsync(string pattern)
        {
            var server = _redis.GetServer(_redis.GetEndPoints().First());
            // البحث عن أي كاش يبدأ بـ pattern (مثل /api/products)
            var keys = server.Keys(pattern: $"*{pattern}*").ToArray();
            if (keys.Length > 0)
            {
                await _database.KeyDeleteAsync(keys);
            }
        }
    }
}
