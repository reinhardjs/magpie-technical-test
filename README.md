# Digital Library Management System

![image](https://github.com/user-attachments/assets/15112fcc-fa44-475a-9351-2f7afa79df57)

## Backend

A robust REST API backend for managing a digital library system built with Fastify, Prisma, and PostgreSQL.

### Features

- 🔐 JWT Authentication & Role-based Authorization
- 📚 Book Management
- 👥 Member Management
- 📖 Lending Management
- 🏷️ Category Management
- 📊 Analytics
- 📝 API Documentation with Swagger

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Tech Stack

- **Framework**: Fastify
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **Security**: bcrypt for password hashing

### Getting Started

1. Clone the repository and navigate to backend folder:
   ```bash
   git clone https://github.com/reinhardjs/magpie-technical-test.git
   cd magpie-technical-test/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env file with your database credentials and JWT secret
   ```

   Configure the following variables in `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/digital_library"
   JWT_SECRET="your-secret-key"
   ```
4. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### API Documentation

The API documentation is available via Swagger UI (http://localhost:3000/documentation)

### API Endpoints

#### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

#### Books
- POST `/api/books` - Create new book (Admin/Librarian)
- GET `/api/books` - Get all books
- PUT `/api/books/:id` - Update book (Admin/Librarian)

#### Members
- POST `/api/members` - Create new member (Admin/Librarian)
- GET `/api/members` - Get all members (Admin/Librarian)
- GET `/api/members/:id` - Get member by ID (Admin/Librarian)
- PUT `/api/members/:id` - Update member (Admin/Librarian)
- DELETE `/api/members/:id` - Delete member (Admin/Librarian)

#### Lendings
- POST `/api/lendings` - Create lending record (Admin/Librarian)
- GET `/api/lendings` - Get all lendings (Admin/Librarian)
- GET `/api/lendings/:id` - Get lending by ID (Admin/Librarian)
- PUT `/api/lendings/:id` - Update lending (Admin/Librarian)
- PUT `/api/lendings/:id/return` - Return book (Admin/Librarian)

#### Categories
- POST `/api/categories` - Create category (Admin/Librarian)
- GET `/api/categories` - Get all categories
- GET `/api/categories/:id` - Get category by ID
- PUT `/api/categories/:id` - Update category (Admin/Librarian)
- DELETE `/api/categories/:id` - Delete category (Admin/Librarian)

#### Analytics
- GET `/api/analytics/popular-books` - Get popular books statistics (Admin/Librarian)
- GET `/api/analytics/lending-trends` - Get lending trends (Admin/Librarian)

### Scripts
```bash
npm run dev # Start development server
npm run start # Start production server
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate # Run database migrations
```

### Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:
`Authorization: Bearer <your-token>`


### Role-Based Access (RBA)

The system supports three roles:
- `ADMIN`: Full system access
- `LIBRARIAN`: Book and member management
- `MEMBER`: Basic access (view books, categories)

### Error Handling

The API returns standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
