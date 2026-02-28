# SMS Scheduler Web App

Production-ready full-stack SMS scheduling platform with React + Tailwind frontend and Express + MongoDB backend.

## Folder Structure

```
confess/
├── client/                 # React + Vite + Tailwind UI
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── layouts/
│   │   └── pages/
├── server/                 # Express REST API + MongoDB + Twilio + Cron
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── utils/
├── .env.example
└── package.json            # Workspace + shared scripts
```

## Features

- Dashboard with live totals, upcoming schedules, and sent logs
- Contact management with CSV/XLSX upload (Multer + csv-parse + xlsx)
- Device management for Twilio sender numbers
- Bulk SMS scheduling by contacts/devices/date/time
- Persistent scheduled jobs in MongoDB with auto restore on restart
- Twilio real SMS integration
- Glassmorphism responsive UI + route-based sidebar navigation
- Analytics chart on all-in-one overview page

## Installation

1. Copy env template:
   ```bash
   cp .env.example .env
   ```
2. Fill your Twilio credentials and confirm local MongoDB is running.
3. Install dependencies:
   ```bash
   npm install
   ```

## Run locally

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Useful commands

```bash
npm run dev:server
npm run dev:client
npm run build
npm run start
```

## API Endpoints

- `GET /api/dashboard`
- `POST /api/contacts/upload`
- `GET /api/contacts`
- `PUT /api/contacts/:id`
- `DELETE /api/contacts/:id`
- `POST /api/devices`
- `GET /api/devices`
- `POST /api/schedule`
- `GET /api/schedule`

