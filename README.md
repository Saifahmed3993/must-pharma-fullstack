# 💊 MUST PHARMA - Full-Stack Pharmacy & Supplement Management System

![MUST PHARMA Banner](https://socialify.git.ci/Saifahmed3993/must-pharma-fullstack/image?description=1&font=Inter&language=1&name=1&owner=1&pattern=Circuit%20Board&theme=Dark)

> A comprehensive Pharmacy & Supplement Management System built with **ASP.NET Core 8 Web API**, **React (Vite)**, and **SQL Server**. Features include Inventory Management, Order Tracking, and Role-based Access Control.

---

## 🌐 Live Demo

| | Link |
| :--- | :--- |
| 🖥️ **Frontend (Vercel)** | [https://must-pharma-fullstack-8qo3juwvi-saifahmed3993s-projects.vercel.app](https://must-pharma-fullstack-8qo3juwvi-saifahmed3993s-projects.vercel.app) |
| ⚙️ **Backend API (Swagger)** | [https://must-pharma-api.runasp.net/swagger/index.html](https://must-pharma-api.runasp.net/swagger/index.html) |

### 🔑 Demo Admin Credentials
```
Email:    admin@pharma.com
Password: Pa$$w0rd
```

---

## ✨ Key Features

### 🛡️ Admin Dashboard (The Nerve Center)
* **Inventory Control:** Add, update, or delete products with precision.
* **Metadata Management:** Dynamically manage product **Brands** and **Categories**.
* **Order Tracking:** Monitor customer orders and payment statuses in real-time.

### 🛒 E-Commerce Experience
* **Advanced Search:** Fast filtering by product name, brand, or type.
* **Smart Basket:** Real-time persistence of items via Redis-powered shopping cart.
* **Secure Checkout:** Integrated with **Stripe** for trusted financial transactions.
* **Pagination:** Optimized catalog with 12 products per page for smooth browsing.

### 🎨 Design & UX
* **Premium Dark Theme:** A custom-built Indigo/Navy aesthetic designed for long-term usage.
* **Mobile First:** Fully responsive design that works on any device.
* **Clean UI:** Smooth animations and intuitive navigation.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Shadcn/UI |
| **Backend** | ASP.NET Core 8 Web API, Entity Framework Core |
| **Database** | Microsoft SQL Server (MSSQL), Redis (Upstash - Caching & Basket) |
| **Security** | JWT Authentication, ASP.NET Identity Core, Role-based Authorization |
| **Payments** | Stripe API Integration |
| **Deployment** | Vercel (Frontend), MonsterASP/RunASP (Backend), Upstash (Redis) |

---

## 🏗️ Architecture

The project follows a **Repository Pattern** and **Unit of Work** on the backend to ensure clean, maintainable, and testable code. It utilizes:
- **DTOs** for secure data transfer
- **AutoMapper** for object mapping
- **Custom Middlewares** for global exception handling
- **Specification Pattern** for flexible querying
- **Redis Caching** for high-performance basket operations

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   React (Vite)   │────▶│  ASP.NET Core 8  │────▶│   SQL Server     │
│   Vercel Host    │     │  MonsterASP Host  │     │  MonsterASP DB   │
└──────────────────┘     └────────┬─────────┘     └──────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Redis (Upstash)  │
                         │  Basket & Cache   │
                         └──────────────────┘
```

---

## 📸 Screenshots

<p align="center">
  <img src="https://raw.githubusercontent.com/Saifahmed3993/must-pharma-fullstack/main/pharmacy-client/src/assets/hero.png" width="80%" alt="Home Page" />
</p>

---

## ⚙️ Installation & Setup

### Prerequisites
* [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
* [Node.js](https://nodejs.org/)
* [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

### 1. Backend Setup
```bash
cd Talabat.API
dotnet restore
dotnet ef database update
dotnet run
```

### 2. Frontend Setup
```bash
cd pharmacy-client
npm install
npm run dev
```

### 3. Docker Setup (Alternative)
```bash
docker-compose up --build -d
```

---

## 🔒 Environment Variables

To run this project, you will need to add the following variables:

**`appsettings.json`** (Backend):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Your SQL Server connection string",
    "IdentityConnection": "Your Identity DB connection string",
    "Redis": "Your Redis connection string"
  },
  "JWT": {
    "Key": "Your_JWT_Secret_Key_min_32_chars"
  }
}
```

**`.env`** (Frontend):
```env
VITE_API_URL=https://your-api-domain.com/api
```

---

## 📂 Project Structure

```
must-pharma-fullstack/
├── Talabat.API/          # ASP.NET Core 8 Web API
│   ├── Controllers/      # API endpoints
│   ├── Helpers/           # AutoMapper, Resolvers
│   ├── Middlewares/       # Exception handling
│   └── Extensions/       # Service configurations
├── Talabat.BLL/          # Business Logic Layer
│   ├── Interfaces/       # Repository contracts
│   ├── Repositories/     # Data access implementations
│   ├── Services/         # Token, Payment, Email services
│   └── Specifications/   # Query specifications
├── Talabat.DAL/          # Data Access Layer
│   ├── Data/             # DbContext, Migrations, Seed Data
│   ├── Entities/         # Domain models
│   └── Identity/         # Authentication context
├── pharmacy-client/      # React (Vite) Frontend
│   ├── src/components/   # Reusable UI components
│   ├── src/pages/        # Application pages
│   ├── src/context/      # State management
│   └── src/api/          # API service layer
└── docker-compose.yml    # Container orchestration
```

---

## 👨‍💻 Developed By

**Saif Ahmed Elbattawy** — Pharmacy Student & Software Engineer

[![GitHub](https://img.shields.io/badge/GitHub-Saifahmed3993-181717?style=for-the-badge&logo=github)](https://github.com/Saifahmed3993)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
