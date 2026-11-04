# ApexStore

A simple full-stack e-commerce site built with React, Node.js and Express.
Data (products, users, orders) is kept in server memory, so no database is needed.
Note: users and orders reset whenever the server restarts.

## Features
- Home page with product grid, search and category filter
- Product details page
- Shopping cart (add, remove, change quantity, total)
- Register / login with hashed passwords and JWT
- Protected checkout and order history

## Setup
1. Server
   cd server
   npm install
   copy .env.example to .env (set PORT and JWT_SECRET)
   npm start
2. Client
   cd client
   npm install
   npm run dev
3. Open http://localhost:5173

## Environment variables (server/.env)
- PORT
- JWT_SECRET