# Rohan — Human-first Video Collaboration

Rohan is a modern real-time meeting experience built with Next.js, WebRTC, Clerk authentication, and Claude AI assistance. The app focuses on natural, human-centered collaboration with live transcription, AI summaries, and seamless video calls.

## Features

- HD WebRTC video meetings
- Live AI transcription and speaker labels
- Smart meeting summaries and action items
- Secure Clerk authentication
- Mobile-friendly dashboard and spaces
- Flexible session management and room controls

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment file:
   ```bash
   cp .env.local.example .env.local
   ```

3. Update `.env.local` with your keys and URLs.

4. Run the app locally:
   ```bash
   npm run dev
   ```

## Environment variables

The app uses the following environment variables:

- `CLERK_SECRET_KEY` — Clerk secret API key
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk publishable key
- `NEXT_PUBLIC_APP_URL` — App URL, e.g. `http://localhost:3000`
- `NEXT_PUBLIC_SOCKET_URL` — Backend/socket server URL
- `NEXT_PUBLIC_STUN_SERVER_URL` — STUN server URL
- `NEXT_PUBLIC_TURN_SERVER_URL` — TURN server URL (optional)
- `NEXT_PUBLIC_TURN_SERVER_USERNAME` — TURN username (optional)
- `NEXT_PUBLIC_TURN_SERVER_CREDENTIAL` — TURN password/credential (optional)

## Run

- Development: `npm run dev`
- Production build: `npm run build`
- Start production server: `npm start`



## Screenshots

Add screenshot images to a `screenshots/` folder, then update the file names below if needed.

### Landing page

https://res.cloudinary.com/dwxxxmlup/image/upload/v1775387952/Screenshot_2026-04-05_164008_lgnydy.png

https://res.cloudinary.com/dwxxxmlup/image/upload/v1775387951/Screenshot_2026-04-05_164026_wjxlh2.png

### Dashboard

https://res.cloudinary.com/dwxxxmlup/image/upload/v1775387950/Screenshot_2026-04-05_164244_itegad.png

### Meeting room

![Meeting room]https://res.cloudinary.com/dwxxxmlup/image/upload/v1775387950/Screenshot_2026-04-05_164244_itegad.png

https://res.cloudinary.com/dwxxxmlup/image/upload/v1775388151/Screenshot_2026-04-05_165211_ouiusz.png

https://res.cloudinary.com/dwxxxmlup/image/upload/v1775388150/Screenshot_2026-04-05_165121_q56vcx.png

## Notes

This project has been updated so the brand is now `Rohan`, with human-friendly UI copy and smoother meeting messaging.
