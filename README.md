# ExpenseLog – Frontend

ExpenseLog is a modern personal finance tracker designed to help users manage expenses, budgets, and financial insights through a clean and intuitive dashboard.

This repository contains the **frontend application** built with **React, Vite, and Mantine**, which communicates with the ExpenseLog backend API.

---

# Live Demo

**Frontend**
https://expenselog-seven.vercel.app

**Backend API**
https://expenselog-api.onrender.com

**Backend Repo**
https://github.com/vidarshan/expenselog-be

---

# Features

## Authentication

* User registration and login
* JWT-based authentication
* Protected routes
* Persistent login sessions

## Dashboard

* Financial overview
* Account balances
* Monthly spending summary
* Recent transactions
* Spending activity visualization

## Transactions

* Create transactions
* Edit transactions
* Delete transactions
* Categorize expenses
* Associate transactions with accounts
* Date and time tracking

## Accounts

* Create accounts
* Multiple account types

  * Bank
  * Cash
  * Credit
* Balance tracking

## Budgets

* Monthly category budgets
* Budget limit tracking
* Budget vs spending comparison

## AI Insights

* Monthly spending analysis
* Risk detection
* Financial suggestions
* Positive spending feedback

## Activity Tracking

* Transaction history
* Monthly logs
* Spending insights

---

# Tech Stack

## Frontend

* React
* Vite
* Mantine UI
* Redux Toolkit
* Axios
* React Icons
* Moment.js

## Backend (separate repository)

* Node.js
* Express
* MongoDB
* Mongoose
* OpenAI API

## Deployment

* Vercel (Frontend)
* Render (Backend)

---

# Project Structure

```
src
 ├── api
 │   └── axios.js
 │
 ├── components
 │   ├── dashboard
 │   ├── transactions
 │   ├── accounts
 │   └── ui
 │
 ├── pages
 │   ├── Dashboard.jsx
 │   ├── Login.jsx
 │   ├── Register.jsx
 │   ├── Transactions.jsx
 │   └── Accounts.jsx
 │
 ├── store
 │   ├── slices
 │   │   ├── authSlice.js
 │   │   ├── transactionSlice.js
 │   │   ├── accountSlice.js
 │   │   └── budgetSlice.js
 │   └── store.js
 │
 ├── utils
 │
 ├── App.jsx
 └── main.jsx
```

---

# Getting Started

## 1. Clone the repository

```
git clone https://github.com/yourusername/expenselog-frontend.git
cd expenselog-frontend
```

---

## 2. Install dependencies

```
npm install
```

---

## 3. Configure environment variables

Create a `.env` file in the project root.

```
VITE_APP_BE_URL=http://localhost:5000
```

Example for production:

```
VITE_APP_BE_URL=https://expenselog-api.onrender.com
```

---

## 4. Start development server

```
npm run dev
```

The app will run at:

```
http://localhost:5173
```

---

# Production Build

```
npm run build
```

Preview the production build locally:

```
npm run preview
```

---

# API Integration

All API requests are handled using a centralized Axios instance.

Example file:

```
src/api/axios.js
```

Features:

* Base API URL configuration
* Authorization header injection
* Automatic logout on expired tokens

---

# Authentication Flow

1. User logs in
2. Backend returns a JWT token
3. Token is stored in localStorage
4. Axios interceptor attaches token to API requests
5. Backend validates the token

---

# UI Design

ExpenseLog uses **Mantine UI** to create a modern and responsive interface.

Design goals:

* Clean financial dashboard
* Responsive layout
* Minimalist card-based UI
* Clear category color coding
* Intuitive financial insights

---

# Demo Accounts

If the database is seeded with demo data:

**Password for all demo users**

```
Password123!
```

Example demo users:

```
alex.smith1@demo.com
jordan.brown2@demo.com
taylor.johnson3@demo.com
```

---

# Future Improvements

* PWA support
* Recurring transactions
* Savings goals
* Financial forecasting
* Export reports
* Mobile-first UI
* Spending trend analytics

---

# License

MIT License
