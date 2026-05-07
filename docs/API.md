# SPODTH API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://<your-backend-url>/api`

## Authentication

All protected endpoints require JWT token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Get Spotify Authorization URL
```
GET /auth/spotify-url

Response:
{
  "authUrl": "https://accounts.spotify.com/authorize?..."
}
```

### Spotify OAuth Callback
```
POST /auth/spotify-callback
Content-Type: application/json

Body:
{
  "code": "spotify_auth_code"
}

Response:
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "isPremium": false
  },
  "accessToken": "jwt_token",
  "spotifyTokens": {
    "accessToken": "spotify_token",
    "expiresIn": 3600
  }
}
```

### Email/Password Registration
```
POST /auth/register
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

Response:
{
  "success": true,
  "user": { ... },
  "accessToken": "jwt_token"
}
```

### Email/Password Login
```
POST /auth/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "user": { ... },
  "accessToken": "jwt_token"
}
```

---

## User Endpoints

### Get Current User Profile
```
GET /users/me
Authorization: Bearer <token>

Response:
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "username",
  "firstName": "John",
  "lastName": "Doe",
  "profileImageUrl": "https://...",
  "bio": "Music lover",
  "isPremium": false,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Get User by ID
```
GET /users/:userId

Response: Same as above
```

### Update User Profile
```
PUT /users/me/profile
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Updated bio",
  "profileImageUrl": "https://..."
}
```

### Get User Following
```
GET /users/:userId/following?limit=20&offset=0

Response:
[
  {
    "id": "uuid",
    "username": "other_user",
    "profileImageUrl": "https://..."
  }
]
```

### Follow User
```
POST /users/:userId/follow
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "User followed"
}
```

---

## Track Endpoints

### Search Tracks
```
GET /tracks/search?q=track_name&limit=20&offset=0

Response:
[
  {
    "id": "spotify_id",
    "title": "Track Name",
    "artists": "Artist 1, Artist 2",
    "duration": 180000,
    "image": "https://...",
    "preview": "https://preview.spotifycdn.com/...",
    "explicit": false
  }
]
```

### Get Track Details
```
GET /tracks/:trackId

Response:
{
  "id": "uuid",
  "spotifyId": "spotify_id",
  "title": "Track Name",
  "duration_ms": 180000,
  "artwork_url": "https://...",
  "popularity": 75,
  "artists": [
    { "id": "uuid", "name": "Artist Name" }
  ]
}
```

### Like Track
```
POST /tracks/:trackId/like
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Track liked"
}
```

### Get Liked Songs
```
GET /tracks/me/liked?limit=20&offset=0
Authorization: Bearer <token>

Response:
[
  { track objects }
]
```

### Get Audio Features
```
GET /tracks/:trackId/features

Response:
{
  "bpm": 120,
  "energy": 0.8,
  "danceability": 0.75,
  "valence": 0.7,
  "acousticness": 0.1,
  "instrumentalness": 0,
  "liveness": 0.2,
  "speechiness": 0.05
}
```

---

## Playlist Endpoints

### Create Playlist
```
POST /playlists
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "title": "My Playlist",
  "description": "Description",
  "isPublic": false
}

Response:
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "My Playlist",
  "description": "Description",
  "is_public": false,
  "total_tracks": 0,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Get User Playlists
```
GET /playlists?limit=20&offset=0
Authorization: Bearer <token>

Response:
[
  { playlist objects }
]
```

### Get Playlist Details
```
GET /playlists/:playlistId

Response:
{
  "id": "uuid",
  "title": "My Playlist",
  "description": "Description",
  "image_url": "https://...",
  "is_public": false,
  "total_tracks": 5,
  "owner_name": "username"
}
```

### Get Playlist Tracks
```
GET /playlists/:playlistId/tracks?limit=20&offset=0

Response:
[
  { track objects with added_at }
]
```

### Add Track to Playlist
```
POST /playlists/:playlistId/tracks
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "trackId": "uuid",
  "position": 0
}
```

### Remove Track from Playlist
```
DELETE /playlists/:playlistId/tracks/:trackId
Authorization: Bearer <token>
```

### Update Playlist
```
PUT /playlists/:playlistId
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "title": "Updated Title",
  "description": "Updated description",
  "imageUrl": "https://...",
  "isPublic": true
}
```

---

## Search Endpoints

### Global Search
```
GET /search?q=query&type=track&limit=20&offset=0

Response:
{
  "query": "query",
  "type": "track",
  "results": [ ... ],
  "total": 20
}
```

### Get Trending Tracks
```
GET /search/trending/tracks

Response:
[
  { track objects }
]
```

### Get New Releases
```
GET /search/new-releases?limit=20&offset=0

Response:
[
  { album objects }
]
```

### Get Recommendations
```
POST /search/recommendations
Content-Type: application/json

Body:
{
  "seedTracks": ["track_id_1", "track_id_2"],
  "limit": 20
}

Response:
[
  { track objects }
]
```

---

## Streaming Endpoints

### Get Stream URL
```
POST /stream/url
Content-Type: application/json

Body:
{
  "trackId": "uuid",
  "previewUrl": "https://..."
}

Response:
{
  "url": "https://<backend>/api/stream/preview/...",
  "type": "preview",
  "corsEnabled": true
}
```

### Stream Preview
```
GET /stream/preview/:trackId?previewUrl=<url>

Supports Range headers for seeking
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

- **Default**: 100 requests per 15 minutes per IP
- **Headers**:
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1705334400
  ```

---

## Pagination

All list endpoints support:
- `limit`: Number of items per page (default: 20, max: 50)
- `offset`: Number of items to skip (default: 0)

Example:
```
GET /playlists?limit=20&offset=40
```
