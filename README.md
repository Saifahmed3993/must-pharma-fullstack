# 💊 MUST PHARMA - Full-Stack Pharmacy Management System

![MUST PHARMA Banner](https://socialify.git.ci/Saifahmed3993/must-pharma-fullstack/image?description=1&font=Inter&language=1&name=1&owner=1&pattern=Circuit%20Board&theme=Dark)

**MUST PHARMA** is a high-performance, professional-grade pharmacy management solution. Built with the **.NET & React** ecosystem, it focuses on performance, sleek Dark Mode aesthetics, and secure pharmaceutical operations.

---

## 🚀 Live Demo
🔗 [View Must Pharma Live](https://must-pharma.vercel.app) *(Link your Vercel deployment here)*

---

## ✨ Key Features

### 🛡️ Admin Dashboard (The Nerve Center)
* **Inventory Control:** Add, update, or delete medicines with precision.
* **Metadata Management:** Dynamically manage pharmaceutical **Brands** and **Dosage Forms**.
* **Order Tracking:** Monitor customer orders and payment statuses in real-time.

### 🛒 E-Commerce Experience
* **Advanced Search:** Fast filtering by medicine name, brand, or type.
* **Smart Basket:** Real-time persistence of items in the shopping cart.
* **Secure Checkout:** Integrated with **Stripe** for trusted financial transactions.

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
| **Database** | Microsoft SQL Server (MSSQL), Redis (for Caching) |
| **Security** | JWT Authentication, Identity Core, Stripe API |
| **Deployment** | Vercel (Frontend), Railway/Azure (Backend) |

---

## 🏗️ Architecture
The project follows a **Repository Pattern** and **Unit of Work** on the backend to ensure clean, maintainable, and testable code. It utilizes DTOs for secure data transfer and custom Middlewares for global exception handling.

---

## 📸 Screenshots

<p align="center">
  <img src="https://raw.githubusercontent.com/Saifahmed3993/must-pharma-fullstack/main/pharmacy-client/src/assets/hero.png" width="45%" alt="Home Page" />
  <img src="https://raw.githubusercontent.com/Saifahmed3993/must-pharma-fullstack/main/screenshots/admin.jpg" width="45%" alt="Admin Dashboard" />
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
2. Frontend Setup
Bash
cd pharmacy-client
npm install
npm run dev
🔒 Environment Variables
To run this project, you will need to add the following variables to your .env and appsettings.json:

Stripe:SecretKey, Stripe:PublishableKey, Jwt:Key, ConnectionStrings:DefaultConnection

👨‍💻 Developed By
Saif Ahmed Elbattawy Pharmacy Student & Software Engineer
