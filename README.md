# SandboxPay ID

SandboxPay ID adalah mock payment gateway sandbox untuk developer yang ingin belajar integrasi pembayaran tanpa memproses uang asli.

Project ini menyediakan API untuk membuat transaksi, payment simulator, API key authentication, webhook callback, webhook logs, dan developer dashboard.

## Disclaimer

SandboxPay ID hanya untuk edukasi dan testing. Project ini tidak memproses uang asli dan tidak terhubung dengan e-wallet, bank, QRIS, atau payment gateway resmi mana pun.

## Tech Stack

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL / Supabase
- JWT Authentication
- API Key Authentication
- Webhook HMAC Signature

### Frontend
- React
- Vite
- React Router DOM
- CSS Custom

## Main Features

- Developer register and login
- JWT authentication
- Generate and reset API key
- Create sandbox transaction
- Payment simulator page
- Simulate payment success, failed, pending, and expired
- Webhook callback sender
- Webhook logs
- Retry webhook
- API documentation page
- Developer dashboard frontend

## Project Structure

```txt
sandboxpay-id/
├─ backend/
│  ├─ prisma/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ controllers/
│  │  ├─ middlewares/
│  │  ├─ routes/
│  │  ├─ services/
│  │  └─ utils/
│  ├─ .env.example
│  ├─ package.json
│  └─ server.js
│
├─ frontend/
│  ├─ src/
│  ├─ .env.example
│  ├─ package.json
│  └─ index.html
│
└─ README.md