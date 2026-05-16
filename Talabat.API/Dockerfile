FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Talabat.API/Talabat.API.csproj", "Talabat.API/"]
COPY ["Talabat.BLL/Talabat.BLL.csproj", "Talabat.BLL/"]
COPY ["Talabat.DAL/Talabat.DAL.csproj", "Talabat.DAL/"]
RUN dotnet restore "Talabat.API/Talabat.API.csproj"
COPY . .
WORKDIR "/src/Talabat.API"
RUN dotnet build "Talabat.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Talabat.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Create directories for uploaded images (products, users)
RUN mkdir -p /app/wwwroot/images/products /app/wwwroot/images/users

EXPOSE 80
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Talabat.API.dll"]
