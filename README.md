# 🚀 BuyerForeSight - Backend Assignment

## 📌 Overview

This project is a **User Management REST API** built using **Node.js (Express)**.
It provides CRUD operations for managing users along with filtering, sorting, and security features.

---

## 🛠️ Tech Stack

* **Node.js**
* **Express.js**
* **Middleware:**

  * CORS
  * Helmet (Security)
  * Express Rate Limit

---

## ✨ Features

* ✅ Create, Read, Update, Delete (CRUD) users
* 🔍 Search users by name/email
* 🔃 Sort users (ascending/descending)
* ⚡ Rate limiting for API protection
* 🔐 Security headers using Helmet
* 🌐 Cross-Origin support (CORS)
* ❤️ Health check endpoint

---

## 📂 Project Structure

```
project/
│── server.js
│── package.json
```

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/backendTaskBuyerForeSight.git
cd backendTaskBuyerForeSight
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Run the server

```bash
node server.js
```

Server will run on:

```
http://localhost:3000/api
```

---

## 📡 API Endpoints

### 🔹 Get all users

```http
GET /api/users
```

#### Optional Query Params:

* `search=` → Search by name/email
* `sort=name&order=asc` → Sorting

---

### 🔹 Get user by ID

```http
GET /api/users/:id
```

---

### 🔹 Create user

```http
POST /api/users
```

#### Request Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 25
}
```

---

### 🔹 Update user

```http
PUT /api/users/:id
```

---

### 🔹 Delete user

```http
DELETE /api/users/:id
```

---

### 🔹 Health Check

```http
GET /api/health
```

---

## 🧠 Data Storage

* Uses **in-memory storage**
* No database required

---

## 🔐 Security Features

* **Helmet** → Secure HTTP headers
* **Rate Limiting** → Prevent abuse (100 requests / 15 mins)

---

## ⚠️ Error Handling

* Proper status codes:

  * `400` → Validation errors
  * `404` → Not found
  * `409` → Conflict (duplicate email)
  * `500` → Server error

---

## 📌 Example Response

```json
{
  "success": true,
  "data": [],
  "count": 2
}
```

---

## 👨‍💻 Author

**Ganesh Nidigonda**

---

## 📄 License

This project is for **assignment/demo purposes only**.
