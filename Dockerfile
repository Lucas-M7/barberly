FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

COPY BarberShop.slnx .
COPY src/BarberShop.API/BarberShop.API.csproj src/BarberShop.API/
COPY src/BarberShop.Application/BarberShop.Application.csproj src/BarberShop.Application/
COPY src/BarberShop.Domain/BarberShop.Domain.csproj src/BarberShop.Domain/
COPY src/BarberShop.Infrastructure/BarberShop.Infrastructure.csproj src/BarberShop.Infrastructure/
RUN dotnet restore

COPY src/ src/
RUN dotnet publish src/BarberShop.API/BarberShop.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

RUN apt-get update && apt-get install -y libgssapi-krb5-2 && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "BarberShop.API.dll"]