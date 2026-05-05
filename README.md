# NexoRH

A multi-tenant Human Resources and Internal Operations Management System for Small and Medium Businesses (SMBs).

## 🏗️ Tech Stack

**Backend**
- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [PostgreSQL](https://www.postgresql.org/) - Relational database
- [Prisma ORM](https://www.prisma.io/) - Database toolkit
- [JWT](https://jwt.io/) - Authentication
- [Swagger](https://swagger.io/) - API documentation

**Frontend**
- [Next.js 14](https://nextjs.org/) - React framework
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS

**Infrastructure**
- [Docker](https://www.docker.com/) + [docker-compose](https://docs.docker.com/compose/)

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ and npm
- [PostgreSQL](https://www.postgresql.org/) 14+ (or use Docker)
- [Docker](https://www.docker.com/) (optional, for containerized setup)

---

### Option A: Docker Setup (Recommended)

The easiest way to run the full stack locally:

```bash
# Clone the repository
git clone <repository-url>
cd NexoRH

# Start all services (postgres + backend + frontend)
docker-compose up --build
```

Services will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Swagger Docs**: http://localhost:3001/api/docs
- **PostgreSQL**: localhost:5432

---

### Option B: Manual Setup

#### 1. Database Setup

Start PostgreSQL (or use Docker):

```bash
docker run -d \
  --name nexorh_db \
  -e POSTGRES_USER=nexorh \
  -e POSTGRES_PASSWORD=nexorh \
  -e POSTGRES_DB=nexorh \
  -p 5432:5432 \
  postgres:16-alpine
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env if needed (default values work with docker postgres above)

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with demo data
npx prisma db seed

# Start the backend in development mode
npm run start:dev
```

Backend will be available at:
- **API**: http://localhost:3001/api
- **Swagger**: http://localhost:3001/api/docs

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Start the frontend in development mode
npm run dev
```

Frontend will be available at: http://localhost:3000

---

## 🔑 Demo Credentials

After seeding the database, you can log in with:

| Field | Value |
|-------|-------|
| Email | admin@nexorh.com |
| Password | admin123 |
| Role | ADMIN |
| Company | Acme Corp |

---

## 📁 Project Structure

```
NexoRH/
├── backend/                    # NestJS API
│   ├── src/
│   │   ├── app.module.ts       # Root module
│   │   ├── main.ts             # Entry point + Swagger config
│   │   ├── prisma/             # Prisma service
│   │   ├── common/
│   │   │   ├── decorators/     # @Roles(), @CurrentUser()
│   │   │   └── guards/         # JwtAuthGuard, RolesGuard
│   │   └── modules/
│   │       ├── auth/           # Register, Login, JWT
│   │       ├── users/          # User CRUD
│   │       ├── companies/      # Company info
│   │       ├── messaging/      # 💬 Placeholder
│   │       ├── tables/         # 📊 Placeholder
│   │       ├── recruitment/    # 🎯 Placeholder
│   │       └── automation/     # ⚡ Placeholder
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.ts             # Demo data seed
│   └── Dockerfile
├── frontend/                   # Next.js App
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/          # Login + Register page
│   │   │   └── dashboard/      # Protected dashboard
│   │   ├── components/         # Reusable components
│   │   └── services/
│   │       └── api.ts          # API client
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🔐 Authentication

NexoRH uses JWT Bearer tokens for authentication.

**Register a new company:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "My Company",
    "fullName": "John Doe",
    "email": "john@mycompany.com",
    "password": "securepassword"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@nexorh.com",
    "password": "admin123"
  }'
```

Response includes an `accessToken`. Use it in subsequent requests:
```bash
curl http://localhost:3001/api/users \
  -H "Authorization: Bearer <your-token>"
```

---

## 👥 User Roles

| Role | Description |
|------|-------------|
| `ADMIN` | Full access to all features |
| `MANAGER` | Operational access, can manage users |
| `USER` | Limited read access |

---

## 🏢 Multi-Tenancy

All data is scoped by `company_id`. The JWT token contains `companyId` in its payload, and all queries automatically filter by the authenticated user's company — preventing any cross-company data access.

---

## 📖 API Documentation

Swagger UI is available at: **http://localhost:3001/api/docs**

All protected endpoints require a Bearer token. Click "Authorize" in Swagger UI and enter: `Bearer <your-token>`

---

## 🧩 Available Modules

| Module | Status | Description |
|--------|--------|-------------|
| Auth | ✅ Active | Registration, login, JWT |
| Users | ✅ Active | CRUD, roles, multi-tenant |
| Companies | ✅ Active | Company information |
| Messaging | 🚧 Planned | Real-time internal chat |
| Dynamic Tables | 🚧 Planned | Custom data management |
| Recruitment | 🚧 Planned | Job postings & candidates |
| Automation | 🚧 Planned | Event-based workflows |

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://nexorh:nexorh@localhost:5432/nexorh` | PostgreSQL connection string |
| `JWT_SECRET` | (required) | Secret key for JWT signing |
| `JWT_EXPIRATION` | `7d` | JWT token expiration time |
| `PORT` | `3001` | Backend server port |

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Backend API URL |

---

## 🛡️ Security Notes

- Always change `JWT_SECRET` in production
- Passwords are hashed with bcrypt (10 rounds)
- All routes are protected by JWT authentication except `/api/auth/register` and `/api/auth/login`
- All database queries are scoped by `companyId` to prevent cross-tenant data leakage
