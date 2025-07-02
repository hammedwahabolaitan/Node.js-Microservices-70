# 🚀 Scalable Microservice Web Platform

A production-ready, full-stack microservice platform built with **Node.js**, **Next.js 15**, and **Kong Gateway**. This comprehensive solution provides everything needed to build scalable web applications with authentication, real-time communication, payment processing, file management, and database persistence.

![Platform Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)
![Database](https://img.shields.io/badge/Database-MongoDB%20%7C%20PostgreSQL-green)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%2015-black)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-yellow)

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Database Configuration](#-database-configuration)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Authentication Flow](#-authentication-flow)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

## ✨ Features

### 🔐 **Authentication & Security**
- JWT-based authentication with refresh tokens
- OTP verification via SMS (Twilio integration)
- Role-based access control (Admin/User)
- Password hashing with bcrypt
- Secure session management

### 📦 **Order Management System**
- Complete order lifecycle management
- Real-time order tracking
- Inventory management
- Order status updates
- Customer order history

### 💳 **Payment Processing**
- Multi-gateway support (Stripe & PayPal)
- Secure payment processing
- Transaction history and reporting
- Refund management
- Payment method storage

### 💬 **Real-time Communication**
- WebSocket-based messaging
- Group and direct chats
- WebRTC video/audio calls
- File sharing in chats
- Online presence indicators

### 📁 **File Management**
- Google Cloud Storage integration
- Secure file upload/download
- File sharing and permissions
- Storage quota management
- Multiple file type support

### 👨‍💼 **Admin Dashboard**
- Service health monitoring
- User management
- Analytics and reporting
- System metrics
- Configuration management

### 🗄️ **Database Support**
- **MongoDB**: Document-based NoSQL database
- **PostgreSQL**: Relational database with ACID compliance
- Database-agnostic architecture
- Automatic migrations
- Connection pooling

## 🛠 Technology Stack

### **Frontend**
| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React Framework | 15.0+ |
| **TypeScript** | Type Safety | 5.0+ |
| **Tailwind CSS** | Styling | 3.3+ |
| **shadcn/ui** | UI Components | Latest |
| **Redux Toolkit** | State Management | 1.9+ |
| **React Hook Form** | Form Management | Latest |

### **Backend**
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime Environment | 18+ |
| **Express.js** | Web Framework | 4.18+ |
| **JWT** | Authentication | 9.0+ |
| **bcryptjs** | Password Hashing | 2.4+ |
| **WebSocket** | Real-time Communication | Latest |

### **Databases**
| Database | Purpose | Features |
|----------|---------|----------|
| **PostgreSQL** | Primary Database | ACID, Relations, Performance |
| **MongoDB** | Document Store | Flexibility, Scalability |
| **Redis** | Caching Layer | Session Storage, Performance |

### **Infrastructure**
| Service | Purpose | Provider |
|---------|---------|----------|
| **Kong Gateway** | API Management | Self-hosted |
| **Google Cloud Storage** | File Storage | Google Cloud |
| **Twilio** | SMS/OTP Service | Twilio |
| **Docker** | Containerization | Docker Inc. |

## 🏗 Architecture Overview

### **System Architecture Diagram**

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Next.js Frontend  │  Mobile App  │  Third-party Integrations   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│              Kong Gateway (Load Balancer + Routing)             │
│              • Rate Limiting  • Authentication                  │
│              • CORS          • Request/Response Transformation  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MICROSERVICES LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  Auth Service  │  Order Service  │  Payment Service             │
│  Chat Service  │  File Service   │  Admin Service               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL/MongoDB  │  Redis Cache  │  Google Cloud Storage    │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

### **Service Communication Flow**

1. **Client Request** → API Gateway (Kong)
2. **API Gateway** → Route to appropriate microservice
3. **Microservice** → Process business logic
4. **Database Layer** → Data persistence and retrieval
5. **Response** → Back through the same chain

### **Key Architectural Principles**

- **Microservices**: Independent, loosely coupled services
- **Database per Service**: Each service owns its data
- **API-First**: RESTful APIs with OpenAPI documentation
- **Event-Driven**: Asynchronous communication where needed
- **Scalable**: Horizontal scaling capabilities
- **Resilient**: Circuit breakers and retry mechanisms

## 📁 Project Structure

\`\`\`
microservice-platform/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 api/                      # API Routes (Microservices)
│   │   ├── 📁 auth/                 # Authentication Service
│   │   │   ├── login/route.ts       # User login endpoint
│   │   │   ├── register/route.ts    # User registration
│   │   │   ├── verify-otp/route.ts  # OTP verification
│   │   │   └── verify/route.ts      # Token verification
│   │   ├── 📁 orders/               # Order Management Service
│   │   │   ├── route.ts             # CRUD operations
│   │   │   └── [id]/status/route.ts # Status updates
│   │   ├── 📁 payments/             # Payment Processing Service
│   │   │   ├── route.ts             # Payment history
│   │   │   ├── process/route.ts     # Payment processing
│   │   │   └── methods/route.ts     # Payment methods
│   │   ├── 📁 chat/                 # Real-time Communication
│   │   │   └── rooms/route.ts       # Chat rooms management
│   │   ├── 📁 files/                # File Management Service
│   │   │   ├── route.ts             # File operations
│   │   │   └── upload/route.ts      # File upload
│   │   ├── 📁 admin/                # Admin Management Service
│   │   │   ├── services/route.ts    # Service monitoring
│   │   │   └── metrics/route.ts     # System metrics
│   │   └── 📁 health/               # Health Check Service
│   │       └── database/route.ts    # Database health
│   ├── 📁 components/               # React Components
│   │   ├── 📁 auth/                 # Authentication UI
│   │   │   └── AuthModal.tsx        # Login/Register modal
│   │   ├── 📁 dashboard/            # Dashboard Components
│   │   │   └── CustomerDashboard.tsx
│   │   ├── 📁 orders/               # Order Management UI
│   │   │   └── OrderManagement.tsx
│   │   ├── 📁 payments/             # Payment Interface
│   │   │   └── PaymentInterface.tsx
│   │   ├── 📁 chat/                 # Chat Interface
│   │   │   └── ChatInterface.tsx
│   │   ├── 📁 files/                # File Manager
│   │   │   └── FileManager.tsx
│   │   └── 📁 admin/                # Admin Dashboard
│   │       └── AdminDashboard.tsx
│   ├── 📁 store/                    # Redux Store
│   │   ├── store.ts                 # Store configuration
│   │   └── 📁 slices/               # Redux slices
│   │       └── authSlice.ts         # Authentication state
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Home page
│   └── globals.css                  # Global styles
├── 📁 lib/                          # Utility Libraries
│   ├── 📁 database/                 # Database Layer
│   │   ├── 📁 models/               # Database Models
│   │   │   ├── User.ts              # User model
│   │   │   ├── Order.ts             # Order model
│   │   │   └── Payment.ts           # Payment model
│   │   ├── mongodb.ts               # MongoDB connection
│   │   ├── postgresql.ts            # PostgreSQL connection
│   │   └── config.ts                # Database configuration
│   └── utils.ts                     # Utility functions
├── 📁 components/ui/                # shadcn/ui Components
│   ├── button.tsx                   # Button component
│   ├── card.tsx                     # Card component
│   ├── dialog.tsx                   # Dialog component
│   └── ...                          # Other UI components
├── 📁 scripts/                      # Database & Setup Scripts
│   ├── 📁 postgresql/               # PostgreSQL Scripts
│   │   ├── 001_initial_schema.sql   # Database schema
│   │   └── 002_seed_data.sql        # Seed data
│   ├── 📁 mongodb/                  # MongoDB Scripts
│   │   ├── 001_initial_collections.js
│   │   └── 002_seed_data.js
│   └── setup-database.js            # Database setup script
├── 📁 docker/                       # Docker Configuration
│   ├── 📁 kong/                     # Kong Gateway config
│   │   └── kong.yml                 # Kong configuration
│   └── docker-compose.yml           # Multi-container setup
├── 📁 docs/                         # Documentation
│   ├── api.md                       # API documentation
│   ├── deployment.md                # Deployment guide
│   └── architecture.md              # Architecture details
├── .env.local                       # Environment variables
├── .env.example                     # Environment template
├── package.json                     # Dependencies
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # This file
\`\`\`

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

### **Required Software**
- **Node.js** (v18.0 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Git** - Version control
- **Docker** (optional) - For containerized services

### **Database Requirements**
Choose one or both databases:

**PostgreSQL** (Recommended for production)
- PostgreSQL 13+ - [Download](https://postgresql.org/download/)
- Or use cloud services: AWS RDS, Google Cloud SQL, etc.

**MongoDB** (Alternative option)
- MongoDB 5.0+ - [Download](https://mongodb.com/try/download/community)
- Or use MongoDB Atlas (cloud)

### **External Services** (Optional)
- **Twilio Account** - For SMS/OTP functionality
- **Stripe Account** - For payment processing
- **PayPal Developer Account** - For PayPal payments
- **Google Cloud Account** - For file storage

## 🚀 Installation & Setup

### **1. Clone the Repository**

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/microservice-platform.git

# Navigate to project directory
cd microservice-platform

# Install dependencies
npm install
\`\`\`

### **2. Environment Configuration**

Create environment files from templates:

\`\`\`bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
nano .env.local  # or use your preferred editor
\`\`\`

### **3. Database Setup**

Choose your preferred database and run the setup:

\`\`\`bash
# For PostgreSQL
export DATABASE_TYPE=postgresql
npm run setup-db

# For MongoDB
export DATABASE_TYPE=mongodb
npm run setup-db

# Verify database connection
npm run db:health
\`\`\`

### **4. Start Development Server**

\`\`\`bash
# Start the development server
npm run dev

# The application will be available at:
# http://localhost:3000
\`\`\`

## 🗄️ Database Configuration

### **PostgreSQL Setup**

1. **Install PostgreSQL**:
   \`\`\`bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # macOS (using Homebrew)
   brew install postgresql
   
   # Windows - Download from postgresql.org
   \`\`\`

2. **Create Database**:
   \`\`\`sql
   -- Connect to PostgreSQL
   psql -U postgres
   
   -- Create database
   CREATE DATABASE microservice_db;
   
   -- Create user (optional)
   CREATE USER microservice_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE microservice_db TO microservice_user;
   \`\`\`

3. **Run Migrations**:
   \`\`\`bash
   # Set environment variable
   export DATABASE_URL="postgresql://username:password@localhost:5432/microservice_db"
   
   # Run setup script
   npm run setup-db
   \`\`\`

### **MongoDB Setup**

1. **Install MongoDB**:
   \`\`\`bash
   # Ubuntu/Debian
   sudo apt-get install mongodb
   
   # macOS (using Homebrew)
   brew install mongodb-community
   
   # Windows - Download from mongodb.com
   \`\`\`

2. **Start MongoDB Service**:
   \`\`\`bash
   # Start MongoDB service
   sudo systemctl start mongod
   
   # Enable auto-start
   sudo systemctl enable mongod
   \`\`\`

3. **Setup Collections**:
   \`\`\`bash
   # Set environment variable
   export MONGODB_URI="mongodb://localhost:27017/microservice_db"
   
   # Run setup script
   npm run setup-db
   \`\`\`

### **Database Schema Overview**

#### **PostgreSQL Tables**
\`\`\`sql
-- Users table
users (id, email, name, phone, password_hash, role, is_verified, created_at, updated_at)

-- Orders table  
orders (id, customer_id, customer_name, customer_email, items, total, status, shipping_address, tracking_number, created_at, updated_at)

-- Payments table
payments (id, order_id, customer_email, amount, currency, method, status, transaction_id, created_at, updated_at)

-- Files table
files (id, name, type, size, url, uploaded_by, is_public, download_count, tags, created_at, updated_at)

-- Chat tables
chat_rooms (id, name, type, created_by, created_at, updated_at)
chat_participants (id, room_id, user_id, joined_at)
messages (id, room_id, sender_id, content, type, created_at)
\`\`\`

#### **MongoDB Collections**
\`\`\`javascript
// Collections with validation schemas
users: { email, name, phone, password_hash, role, is_verified, created_at, updated_at }
orders: { customer_id, customer_name, customer_email, items[], total, status, shipping_address, tracking_number, created_at, updated_at }
payments: { order_id, customer_email, amount, currency, method, status, transaction_id, created_at, updated_at }
files: { name, type, size, url, uploaded_by, is_public, download_count, tags[], created_at, updated_at }
chat_rooms: { name, type, participants[], created_by, created_at, updated_at }
messages: { room_id, sender_id, content, type, created_at }
\`\`\`

## 🔧 Environment Variables

Create a \`.env.local\` file in the root directory with the following variables:

\`\`\`env
# ==============================================
# DATABASE CONFIGURATION
# ==============================================
# Choose database type: 'postgresql' or 'mongodb'
DATABASE_TYPE=postgresql

# PostgreSQL Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/microservice_db

# MongoDB Configuration  
MONGODB_URI=mongodb://localhost:27017/microservice_db

# ==============================================
# AUTHENTICATION & SECURITY
# ==============================================
# JWT Secret (use a strong, random string)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# Session Secret
SESSION_SECRET=your-session-secret-key

# ==============================================
# EXTERNAL SERVICES
# ==============================================
# Twilio (for SMS/OTP)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token  
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# PayPal (for payments)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox  # or 'live' for production

# Google Cloud Storage (for file uploads)
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_STORAGE_BUCKET=your-bucket-name
GOOGLE_CLOUD_KEYFILE=path/to/service-account-key.json

# ==============================================
# REDIS CONFIGURATION (Optional)
# ==============================================
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password

# ==============================================
# APPLICATION SETTINGS
# ==============================================
# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Environment
NODE_ENV=development

# ==============================================
# KONG GATEWAY (Optional)
# ==============================================
KONG_ADMIN_URL=http://localhost:8001
KONG_PROXY_URL=http://localhost:8000

# ==============================================
# EMAIL SERVICE (Optional)
# ==============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# ==============================================
# MONITORING & LOGGING (Optional)
# ==============================================
LOG_LEVEL=info
SENTRY_DSN=your_sentry_dsn
\`\`\`

### **Environment Variable Descriptions**

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| \`DATABASE_TYPE\` | Database to use ('postgresql' or 'mongodb') | Yes | postgresql |
| \`DATABASE_URL\` | PostgreSQL connection string | If using PostgreSQL | - |
| \`MONGODB_URI\` | MongoDB connection string | If using MongoDB | - |
| \`JWT_SECRET\` | Secret key for JWT tokens | Yes | - |
| \`TWILIO_ACCOUNT_SID\` | Twilio account identifier | For SMS/OTP | - |
| \`STRIPE_SECRET_KEY\` | Stripe secret key | For payments | - |
| \`GOOGLE_CLOUD_PROJECT_ID\` | Google Cloud project ID | For file storage | - |

## 🏃‍♂️ Running the Application

### **Development Mode**

\`\`\`bash
# Start development server with hot reload
npm run dev

# The application will be available at:
# Frontend: http://localhost:3000
# API: http://localhost:3000/api
\`\`\`

### **Production Mode**

\`\`\`bash
# Build the application
npm run build

# Start production server
npm start
\`\`\`

### **Docker Setup** (Optional)

\`\`\`bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

### **Available Scripts**

| Script | Description |
|--------|-------------|
| \`npm run dev\` | Start development server |
| \`npm run build\` | Build for production |
| \`npm start\` | Start production server |
| \`npm run lint\` | Run ESLint |
| \`npm run setup-db\` | Setup database schema |
| \`npm run db:health\` | Check database health |
| \`npm test\` | Run tests |

## 📚 API Documentation

### **Authentication Endpoints**

#### **POST /api/auth/login**
Login with email and password.

\`\`\`json
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "token": "jwt_token_here",
  "user": {
    "id": "1",
    "email": "user@example.com", 
    "name": "John Doe",
    "role": "user"
  }
}
\`\`\`

#### **POST /api/auth/register**
Register a new user account.

\`\`\`json
// Request
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "phone": "+1234567890"
}

// Response
{
  "message": "Registration successful. OTP sent to phone.",
  "tempUserId": "temp_12345"
}
\`\`\`

#### **POST /api/auth/verify-otp**
Verify OTP and complete registration.

\`\`\`json
// Request
{
  "phone": "+1234567890",
  "otp": "123456",
  "tempUserId": "temp_12345"
}

// Response
{
  "token": "jwt_token_here",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe", 
    "role": "user"
  }
}
\`\`\`

### **Order Management Endpoints**

#### **GET /api/orders**
Get user's orders (or all orders for admin).

\`\`\`json
// Response
{
  "orders": [
    {
      "id": "1",
      "customer_name": "John Doe",
      "customer_email": "user@example.com",
      "items": [
        {
          "name": "Product A",
          "quantity": 2,
          "price": 29.99
        }
      ],
      "total": 59.98,
      "status": "pending",
      "shipping_address": "123 Main St, City, State",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
\`\`\`

#### **POST /api/orders**
Create a new order.

\`\`\`json
// Request
{
  "customerName": "John Doe",
  "customerEmail": "user@example.com", 
  "items": [
    {
      "name": "Product A",
      "quantity": 2,
      "price": 29.99
    }
  ],
  "total": 59.98,
  "shippingAddress": "123 Main St, City, State"
}

// Response
{
  "order": {
    "id": "1",
    "status": "pending",
    // ... other order fields
  }
}
\`\`\`

### **Payment Processing Endpoints**

#### **GET /api/payments**
Get payment history.

\`\`\`json
// Response
{
  "payments": [
    {
      "id": "1",
      "order_id": "1", 
      "amount": 59.98,
      "currency": "usd",
      "method": "stripe",
      "status": "completed",
      "transaction_id": "txn_12345",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
\`\`\`

#### **POST /api/payments/process**
Process a payment.

\`\`\`json
// Request
{
  "orderId": "1",
  "amount": 59.98,
  "currency": "usd", 
  "method": "stripe",
  "customerEmail": "user@example.com"
}

// Response
{
  "payment": {
    "id": "1",
    "status": "completed",
    "transaction_id": "txn_12345"
  }
}
\`\`\`

### **File Management Endpoints**

#### **GET /api/files**
Get user's files.

\`\`\`json
// Response
{
  "files": [
    {
      "id": "1",
      "name": "document.pdf",
      "type": "application/pdf",
      "size": 1024000,
      "url": "/api/files/1/download",
      "is_public": false,
      "download_count": 5,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
\`\`\`

#### **POST /api/files/upload**
Upload a file.

\`\`\`bash
# Using curl
curl -X POST \
  -H "Authorization: Bearer your_jwt_token" \
  -F "file=@/path/to/file.pdf" \
  http://localhost:3000/api/files/upload
\`\`\`

### **Health Check Endpoints**

#### **GET /api/health/database**
Check database connectivity.

\`\`\`json
// Response
{
  "database": {
    "status": "healthy",
    "type": "postgresql"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
\`\`\`

## 🔐 Authentication Flow

### **Registration Process**

\`\`\`
1. User submits registration form
   ↓
2. Server validates input data
   ↓  
3. Server hashes password with bcrypt
   ↓
4. Server creates user record (is_verified: false)
   ↓
5. Server sends OTP via Twilio SMS
   ↓
6. User enters OTP code
   ↓
7. Server verifies OTP
   ↓
8. Server updates user (is_verified: true)
   ↓
9. Server generates JWT token
   ↓
10. Client receives token and user data
\`\`\`

### **Login Process**

\`\`\`
1. User submits login credentials
   ↓
2. Server finds user by email
   ↓
3. Server verifies password with bcrypt
   ↓
4. Server checks if user is verified
   ↓
5. Server generates JWT token
   ↓
6. Client receives token and user data
   ↓
7. Client stores token in localStorage
   ↓
8. Client includes token in API requests
\`\`\`

### **JWT Token Structure**

\`\`\`json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "1",
    "email": "user@example.com",
    "role": "user",
    "iat": 1640995200,
    "exp": 1641081600
  }
}
\`\`\`

### **Protected Route Access**

\`\`\`javascript
// Middleware checks for valid JWT token
const token = request.headers.authorization?.replace('Bearer ', '')
const decoded = jwt.verify(token, process.env.JWT_SECRET)
const user = await getUserById(decoded.userId)

// User data is available in request context
if (user.role === 'admin') {
  // Allow admin access
} else {
  // Restrict to user's own data
}
\`\`\`

## 🚀 Deployment

### **Vercel Deployment** (Recommended for Frontend)

1. **Connect Repository**:
   \`\`\`bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   \`\`\`

2. **Environment Variables**:
   Add all environment variables in Vercel dashboard under Project Settings → Environment Variables.

3. **Database Connection**:
   Use cloud database services:
   - **PostgreSQL**: AWS RDS, Google Cloud SQL, or Supabase
   - **MongoDB**: MongoDB Atlas

### **Docker Deployment**

1. **Build Docker Image**:
   \`\`\`bash
   # Build the image
   docker build -t microservice-platform .
   
   # Run the container
   docker run -p 3000:3000 --env-file .env.local microservice-platform
   \`\`\`

2. **Docker Compose** (Full Stack):
   \`\`\`bash
   # Start all services
   docker-compose up -d
   
   # Scale services
   docker-compose up -d --scale api=3
   \`\`\`

### **Cloud Deployment Options**

| Platform | Best For | Pros | Cons |
|----------|----------|------|------|
| **Vercel** | Frontend + API Routes | Easy deployment, great DX | Limited backend capabilities |
| **AWS** | Full stack | Scalable, many services | Complex setup |
| **Google Cloud** | Full stack | Good integration | Learning curve |
| **DigitalOcean** | Simple deployment | Cost-effective | Manual setup |
| **Heroku** | Quick deployment | Easy to use | Limited free tier |

### **Production Checklist**

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates installed
- [ ] Domain configured
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Error tracking configured
- [ ] Performance monitoring enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled

## 🧪 Testing

### **Running Tests**

\`\`\`bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- auth.test.js
\`\`\`

### **Test Structure**

\`\`\`
tests/
├── unit/                    # Unit tests
│   ├── models/             # Database model tests
│   ├── utils/              # Utility function tests
│   └── components/         # Component tests
├── integration/            # Integration tests
│   ├── api/               # API endpoint tests
│   └── database/          # Database tests
└── e2e/                   # End-to-end tests
    ├── auth.test.js       # Authentication flow
    ├── orders.test.js     # Order management
    └── payments.test.js   # Payment processing
\`\`\`

### **Test Examples**

#### **Unit Test Example**
\`\`\`javascript
// tests/unit/models/User.test.js
import { UserModel } from '../../../lib/database/models/User'

describe('UserModel', () => {
  test('should hash password correctly', async () => {
    const password = 'testpassword123'
    const hash = await UserModel.hashPassword(password)
    
    expect(hash).not.toBe(password)
    expect(await UserModel.verifyPassword(password, hash)).toBe(true)
  })
})
\`\`\`

#### **API Test Example**
\`\`\`javascript
// tests/integration/api/auth.test.js
import request from 'supertest'
import app from '../../../app'

describe('Authentication API', () => {
  test('POST /api/auth/login should return token for valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      })
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
    expect(response.body).toHaveProperty('user')
  })
})
\`\`\`

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### **Development Workflow**

1. **Fork the Repository**
   \`\`\`bash
   git fork https://github.com/your-username/microservice-platform.git
   \`\`\`

2. **Create Feature Branch**
   \`\`\`bash
   git checkout -b feature/amazing-feature
   \`\`\`

3. **Make Changes**
   - Follow TypeScript best practices
   - Write tests for new features
   - Update documentation
   - Follow existing code style

4. **Test Changes**
   \`\`\`bash
   npm test
   npm run lint
   npm run build
   \`\`\`

5. **Commit Changes**
   \`\`\`bash
   git commit -m "feat: add amazing feature"
   \`\`\`

6. **Push and Create PR**
   \`\`\`bash
   git push origin feature/amazing-feature
   \`\`\`

### **Code Style Guidelines**

- Use **TypeScript** for all new code
- Follow **ESLint** and **Prettier** configurations
- Write **meaningful commit messages**
- Add **JSDoc comments** for functions
- Use **semantic versioning** for releases

### **Pull Request Process**

1. Update README.md with details of changes
2. Update the version numbers following SemVer
3. Ensure all tests pass
4. Request review from maintainers

## 🔧 Troubleshooting

### **Common Issues**

#### **Database Connection Issues**

**Problem**: Cannot connect to database
\`\`\`
Error: connect ECONNREFUSED 127.0.0.1:5432
\`\`\`

**Solutions**:
1. Check if database service is running:
   \`\`\`bash
   # PostgreSQL
   sudo systemctl status postgresql
   
   # MongoDB  
   sudo systemctl status mongod
   \`\`\`

2. Verify connection string in \`.env.local\`
3. Check firewall settings
4. Ensure database exists

#### **JWT Token Errors**

**Problem**: Invalid token errors
\`\`\`
Error: JsonWebTokenError: invalid token
\`\`\`

**Solutions**:
1. Check JWT_SECRET in environment variables
2. Clear browser localStorage:
   \`\`\`javascript
   localStorage.clear()
   \`\`\`
3. Verify token expiration
4. Check token format in requests

#### **File Upload Issues**

**Problem**: File upload fails
\`\`\`
Error: File upload failed
\`\`\`

**Solutions**:
1. Check file size limits
2. Verify Google Cloud Storage configuration
3. Check file permissions
4. Ensure bucket exists and is accessible

#### **OTP/SMS Issues**

**Problem**: OTP not received
\`\`\`
Error: Failed to send SMS
\`\`\`

**Solutions**:
1. Verify Twilio credentials
2. Check phone number format (+1234567890)
3. Ensure Twilio account has sufficient balance
4. Check Twilio service status

### **Debug Mode**

Enable debug logging:
\`\`\`bash
# Enable all debug logs
DEBUG=* npm run dev

# Enable specific debug logs
DEBUG=database,auth npm run dev
\`\`\`

### **Health Checks**

Check system health:
\`\`\`bash
# Database health
curl http://localhost:3000/api/health/database

# Application health
curl http://localhost:3000/api/health
\`\`\`

### **Log Files**

Check application logs:
\`\`\`bash
# Application logs
tail -f logs/app.log

# Database logs (PostgreSQL)
tail -f /var/log/postgresql/postgresql-13-main.log

# Database logs (MongoDB)
tail -f /var/log/mongodb/mongod.log
\`\`\`

## 📞 Support & Community

### **Getting Help**

- **Documentation**: Check this README and \`/docs\` folder
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Ask questions in GitHub Discussions
- **Email**: support@yourplatform.com

### **Community Resources**

- **Discord Server**: [Join our community](https://discord.gg/yourserver)
- **Stack Overflow**: Tag questions with \`microservice-platform\`
- **Blog**: [Technical articles and tutorials](https://blog.yourplatform.com)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### **MIT License Summary**

- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

## 🙏 Acknowledgments

Special thanks to the amazing open-source community and these projects:

- **[Next.js](https://nextjs.org/)** - The React framework for production
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful and accessible UI components
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Kong Gateway](https://konghq.com/)** - API gateway and service mesh
- **[Vercel](https://vercel.com/)** - Platform for frontend frameworks
- **[PostgreSQL](https://postgresql.org/)** - Advanced open source database
- **[MongoDB](https://mongodb.com/)** - Document database for modern apps

---

## 🚀 **Ready to Build Something Amazing?**

This microservice platform provides everything you need to build scalable, production-ready web applications. From authentication to payments, from real-time chat to file management - it's all here and ready to use.

**Start building today!** 🎉

\`\`\`bash
git clone https://github.com/your-username/microservice-platform.git
cd microservice-platform
npm install
npm run setup-db
npm run dev
\`\`\`

**Happy coding!** 💻✨
