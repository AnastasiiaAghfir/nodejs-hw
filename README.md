# NoteHub API
 
A REST API for the NoteHub notes app, built with **Node.js, Express and MongoDB**. Each user has their own notes, protected by session-based authentication.
 
🔗 **Base URL:** https://nodejs-hw-ekl9.onrender.com
 
> The API has no home page, so opening the base URL in a browser shows `Route not found`. Use the endpoints below with Postman or curl.
> Hosted on Render's free plan, so the first request may take up to a minute while the server wakes up.
 
## Features
 
- **Authentication:** register, log in, log out, refresh the session
- **Sessions:** access and refresh tokens stored in httpOnly cookies, sessions saved in MongoDB
- **Password reset:** email with a JWT link (Nodemailer + Handlebars template)
- **Notes CRUD:** each user can only see and edit their own notes
- **Search, filter and pagination:** search by title and content, filter by tag, `page` / `perPage`
- **Avatar upload:** Multer + Cloudinary
- **Validation:** Joi schemas via Celebrate
- **Error handling and logging:** http-errors, custom error middleware, Pino
 
## Tech stack
 
Node.js · Express 5 · MongoDB · Mongoose · bcrypt · JSON Web Token · Celebrate/Joi · Multer · Cloudinary · Nodemailer · Handlebars · Pino
 
## Endpoints
 
Base URL: `https://nodejs-hw-ekl9.onrender.com`
 
### Auth
 
| Method | Route | Body | Description |
|---|---|---|---|
| POST | `/auth/register` | `{ email, password }` | Create an account and start a session |
| POST | `/auth/login` | `{ email, password }` | Log in |
| POST | `/auth/refresh` | – | Refresh the session (uses cookies) |
| POST | `/auth/logout` | – | Log out and clear cookies |
| POST | `/auth/request-reset-email` | `{ email }` | Send a password reset email |
| POST | `/auth/reset-password` | `{ token, password }` | Set a new password |
 
### Notes (login required)
 
| Method | Route | Body / query | Description |
|---|---|---|---|
| GET | `/notes` | `?page=1&perPage=10&tag=Work&search=text` | List notes |
| GET | `/notes/:noteId` | – | Get one note |
| POST | `/notes` | `{ title, content?, tag? }` | Create a note |
| PATCH | `/notes/:noteId` | `{ title?, content?, tag? }` | Update a note |
| DELETE | `/notes/:noteId` | – | Delete a note |
 
Tags: `Work`, `Personal`, `Meeting`, `Shopping`, `Ideas`, `Travel`, `Finance`, `Health`, `Important`, `Todo`.
 
### Users (login required)
 
| Method | Route | Body | Description |
|---|---|---|---|
| PATCH | `/users/me/avatar` | form-data, field `avatar` (image, max 2 MB) | Upload an avatar |
 
## How authentication works
 
1. `POST /auth/register` or `POST /auth/login` sets three httpOnly cookies: `accessToken` (15 min), `refreshToken` (1 day) and `sessionId`.
2. Every request to `/notes` and `/users` must send these cookies. Browsers and tools like Postman do this automatically.
3. When the access token expires, `POST /auth/refresh` creates a new session.
4. Without a valid session, protected routes answer `401 Missing access token`.
 
## Example requests
 
```bash
# Register (cookies are saved to cookies.txt)
curl -c cookies.txt -X POST https://nodejs-hw-ekl9.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
 
# Create a note
curl -b cookies.txt -X POST https://nodejs-hw-ekl9.onrender.com/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"My first note","content":"Hello!","tag":"Todo"}'
 
# Get notes with search and pagination
curl -b cookies.txt "https://nodejs-hw-ekl9.onrender.com/notes?page=1&perPage=10&search=first"
```
 
Example response for `GET /notes`:
 
```json
{
  "page": 1,
  "perPage": 10,
  "totalNotes": 1,
  "totalPages": 1,
  "notes": [
    {
      "_id": "66f1c2a9e4b0a1b2c3d4e5f6",
      "title": "My first note",
      "content": "Hello!",
      "tag": "Todo",
      "createdAt": "2026-09-23T10:00:00.000Z",
      "updatedAt": "2026-09-23T10:00:00.000Z"
    }
  ]
}
```
 
## Run locally
 
```bash
npm install
cp .env.example .env   # fill in the values
npm run dev
```
 
Environment variables: `PORT`, `MONGO_URL`, `JWT_SECRET`, `FRONTEND_DOMAIN`, SMTP settings (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`) and Cloudinary keys (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
 
## Project structure
 
```
src/
  controllers/   request handlers (auth, notes, users)
  routes/        Express routers
  models/        Mongoose models (User, Note, Session)
  middleware/    auth, errors, logger, file upload
  validations/   Joi schemas
  services/      session helpers
  utils/         email and Cloudinary helpers
```
 
---
 
Built by [Anastasiia Aghfir](https://github.com/AnastasiiaAghfir) as part of the GoIT Full Stack Developer program.
 


