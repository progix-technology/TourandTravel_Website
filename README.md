# 🌍 Luxury Tours & Travellers Web Application

A full-stack luxury travel and tour management platform built with Node.js, Express, MongoDB, and React (Vite).

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **MongoDB**: MongoDB Atlas URI or Local MongoDB instance
- **npm** or **yarn**

---

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create local environment file from example template
cp .env.example .env

# Configure your .env with your MongoDB URI, JWT Secret, and Cloudinary keys:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret

# Start backend server in development mode
npm run dev
```

The backend API will run on `http://localhost:5000`.

---

### 3. Frontend Setup

```bash
# In a separate terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

The frontend application will be live at `http://localhost:5173`.

---

## 🔒 Security & Credentials Protection
- All `.env` configuration files containing private database URIs, JWT secrets, and Cloudinary keys are **strictly ignored by `.gitignore`**.
- Never commit `.env` files to public or private version control.
- Use `.env.example` as a template when setting up new environments.
