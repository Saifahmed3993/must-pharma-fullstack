using Microsoft.AspNetCore.Http;
using System;
using System.IO;

namespace Talabat.API.Helpers
{
    public static class DocumentSettings
    {
        public static string UploadFile(IFormFile file, string folderName)
        {
            // 1. Get Directory Path
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", folderName);

            // Create Directory if it doesn't exist
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            // 2. Generate Unique File Name
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            // 3. Get File Path
            var filePath = Path.Combine(folderPath, fileName);

            // 4. Save File as Stream
            using var fileStream = new FileStream(filePath, FileMode.Create);
            file.CopyTo(fileStream);

            // 5. Return Relative File Path
            return $"images/{folderName}/{fileName}";
        }

        public static void DeleteFile(string fileUrl, string folderName)
        {
            if (string.IsNullOrEmpty(fileUrl)) return;

            try
            {
                string fileName;
                if (Uri.TryCreate(fileUrl, UriKind.Absolute, out var uri))
                {
                    fileName = Path.GetFileName(uri.LocalPath);
                }
                else
                {
                    fileName = Path.GetFileName(fileUrl);
                }
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", folderName, fileName);

                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
            }
            catch
            {
                // Fail-safe
            }
        }
    }
}
