# API Documentation for Frontend Developers

Base URL: `http://localhost:8000/api/v1` (locally)

## Authentication

The API uses OAuth2 with Password Flow (Bearer Token).

### 1. Login
**Endpoint**: `POST /login/access-token`
**Content-Type**: `application/x-www-form-urlencoded`

| Field | Type | Description |
|---|---|---|
| `username` | string | User's username |
| `password` | string | User's password |

**Response** (JSON):
```json
{
  "access_token": "eyJhbG...",
  "token_type": "bearer"
}
```
*Store this token and send it in the `Authorization` header for all protected requests: `Authorization: Bearer <token>`.*

### 2. Register
**Endpoint**: `POST /users/reg`
**Content-Type**: `application/json`

**Body**:
```json
{
  "email": "user@example.com",
  "username": "cooluser",
  "password": "securepassword",
  "role": "Author" 
}
```
*Supported Roles*: `"Viewer"`, `"Author"`, `"Admin"`

---

## Authorization & Roles

- **Viewer**: Read-only access to articles.
- **Author**: Can Create, Read, Update (own), and Delete (own) articles.
- **Admin**: Full access to all resources.

---

## Endpoints

### Articles

#### List Articles
**Endpoint**: `GET /articles/`
**Auth**: Required (Any Role)

**Parameters**:
- `skip` (query, optional, default: 0): Pagination offset
- `limit` (query, optional, default: 100): Pagination limit

**Response**:
```json
[
  {
    "title": "Drought Prediction Model v1",
    "content": "Detailed analysis...",
    "id": 1,
    "author_id": 2,
    "created_at": "2026-01-18T13:35:21.288832"
  }
]
```

#### Get Article
**Endpoint**: `GET /articles/{id}`
**Auth**: Required (Any Role)

#### Create Article
**Endpoint**: `POST /articles/`
**Auth**: Required (`Author` or `Admin`)

**Body**:
```json
{
  "title": "New Article Title",
  "content": "Article content goes here..."
}
```

#### Update Article
**Endpoint**: `PUT /articles/{id}`
**Auth**: Required (Owner of article or `Admin`)

**Body** (partial updates allowed):
```json
{
  "title": "Updated Title"
}
```

#### Delete Article
**Endpoint**: `DELETE /articles/{id}`
**Auth**: Required (Owner of article or `Admin`)

### Users

#### Get Current User (Me)
**Endpoint**: `GET /users/me`
**Auth**: Required

**Response**:
```json
{
  "username": "cooluser",
  "email": "user@example.com",
  "role": "Author",
  "is_active": true,
  "id": 2
}
```
