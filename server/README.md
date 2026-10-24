# Server

Separate Express + MongoDB backend for the luxury car rental app.

## Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and set:

- `MONGODB_URI` — your MongoDB connection string (Atlas free tier works)
- `JWT_SECRET` — change the default before any real use
- `PORT` — defaults to `5000`
- `CLIENT_URL` — your Next.js app origin for CORS

## Run

```bash
npm run dev   # restart with nodemon
npm start     # production style
```

The API lands on `http://localhost:5000` by default.

## Seed the fleet

```bash
npm run seed
```

This clears the cars collection and inserts the supercar fleet.

## API

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET  /api/auth/me`
- `GET  /api/cars`
- `GET  /api/cars/:id`
- `POST /api/cars` (admin)
- `PATCH /api/cars/:id` (admin)
- `GET  /api/bookings` (authenticated user)
- `GET  /api/bookings/admin` (admin)
- `POST /api/bookings`
- `PATCH /api/bookings/:id/status` (admin)
