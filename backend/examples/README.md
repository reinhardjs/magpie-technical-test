# CURL Examples

## 1. Authentication Endpoints:

### Register
```
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "librarian@library.com",
    "password": "password123",
    "name": "John Doe",
    "role": "LIBRARIAN"
  }'
```

### Login
```
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "librarian@library.com",
    "password": "password123"
  }'
```

<br>

## 2. Book Endpoints:

### Create Book
```
curl -X POST http://localhost:3000/api/books \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0743273565",
    "quantity": 5,
    "categoryId": 1
  }'
```

### Get All Books
```
curl -X GET http://localhost:3000/api/books \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Book
```
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0743273565",
    "quantity": 10,
    "categoryId": 1
  }'
```

<br>

## 3. Member Endpoints

### Create Member
```
curl -X POST http://localhost:3000/api/members \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "1234567890",
    "status": "ACTIVE"
  }'
```

### Get All Members
```
curl -X GET http://localhost:3000/api/members \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Member by ID
```
curl -X GET http://localhost:3000/api/members/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Member
```
curl -X PUT http://localhost:3000/api/members/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane.updated@example.com",
    "phone": "1234567890",
    "status": "ACTIVE"
  }'
```

### Delete Member
```
curl -X DELETE http://localhost:3000/api/members/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

<br>

## 4. Lending Endpoints

### Create Lending
```
curl -X POST http://localhost:3000/api/lendings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": 1,
    "memberId": 1
  }'
```

### Get All Lendings
```
curl -X GET http://localhost:3000/api/lendings \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Lending by ID
```
curl -X GET http://localhost:3000/api/lendings/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Return Book
```
curl -X PUT http://localhost:3000/api/lendings/1/return \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Lending
```
curl -X PUT http://localhost:3000/api/lendings/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": 1,
    "memberId": 1,
    "dueDate": "2024-02-28T00:00:00Z"
  }'
```

<br>

## 5. Category Endpoints

### Create Category
```
curl -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fiction"
  }'
```

### Get All Categories
```
curl -X GET http://localhost:3000/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Category by ID
```
curl -X GET http://localhost:3000/api/categories/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Category
```
curl -X PUT http://localhost:3000/api/categories/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Science Fiction"
  }'
```

### Delete Category
```
curl -X DELETE http://localhost:3000/api/categories/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

<br>

## 6. Analytics Endpoints

### Get Popular Books
```
curl -X GET http://localhost:3000/api/analytics/popular-books \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Lending Trends
```
curl -X GET http://localhost:3000/api/analytics/lending-trends \
  -H "Authorization: Bearer YOUR_TOKEN"
```
