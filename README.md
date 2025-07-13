

---

# 🚀 Learnify – The Modern EdTech Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Click%20Here-brightgreen?style=flat\&logo=vercel)](https://learnify-8o13.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/CodeHarshh/Learnify)

> Learnify is a **full-stack EdTech web application** that offers interactive courses, secure authentication, instructor & student dashboards, payment integration, and real-time analytics — everything you need to run a modern online learning platform.

---

## 📚 Features

✨ **Authentication & Authorization**

* JWT + OAuth-based auth
* Role-based routing (Instructor & Student)
* Secure user sessions

🎓 **Courses Management**

* Categorized courses
* Section ➝ Sub-section ➝ Video hierarchy
* Instructor course creation tools

🧾 **Student Dashboard**

* View enrolled courses
* Track progress by section
* Interactive video learning experience

🧑‍🏫 **Instructor Dashboard**

* Upload & manage courses
* Revenue and student analytics
* Real-time charts and metrics

🛒 **Cart & Payments**

* Add/remove courses to cart
* Razorpay/Stripe payment integration
* Post-purchase enrollment & receipt

📊 **User Analytics**

* Graphs for engagement & revenue
* Visual dashboard insights

📬 **Contact Form**

* Fully functional "Contact Us" page
* Responsive and validated form

📱 **Responsive UI**

* Fully mobile/tablet/desktop optimized
* Built with Tailwind CSS

---

## 🛠️ Tech Stack

### 💻 Frontend

* React.js
* Redux Toolkit
* React Router DOM
* Tailwind CSS

### 🔧 Backend

* Node.js
* Express.js
* MongoDB & Mongoose

### 🔐 Auth & Security

* JWT Authentication
* OAuth Login (Google)
* Role-Based Routes (Student/Instructor)

### 💰 Payments

* Razorpay or Stripe

### 📈 Tools & Utilities

* Chart.js or Recharts (for analytics)
* Nodemailer for email OTP
* Concurrently (for dev mode)
* Render (backend hosting)
* Vercel (frontend hosting)

---

## 🧩 Project Structure

```
Learnify/
├── public/
│   └── index.html
├── src/
│   ├── App.js, App.css, index.js, index.css
│   ├── Pages/
│   ├── Components/
│   │   └── Core/
│   │       ├── Auth/       # Auth routes
│   │       ├── Dashboard/  # Student/Instructor dashboards
│   │       ├── ViewCourse/
│   │       ├── Homepage/
│   │       ├── Aboutpage/
│   │       └── Common/     # Navbar, Footer, etc.
│   ├── Assets/Images/
│   ├── reducer/
│   ├── slices/
│   └── utils/
├── server/
│   ├── package.json
│   ├── Mail/
│   ├── Models/
│   ├── Utils/
│   ├── routes/
│   └── controllers/
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 📌 Prerequisites

* Node.js & npm
* MongoDB (local or Atlas)
* `.env` file with:

  ```env
  MONGODB_URI=
  JWT_SECRET=
  CLIENT_URL=http://localhost:3000
  ```

### 🧱 Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/CodeHarshh/Learnify.git
   cd Learnify
   ```

2. **Install Frontend Dependencies**

   ```bash
   npm install
   ```

3. **Install Server Dependencies**

   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Start in Development**

   ```bash
   npm run dev
   ```

---

## 🚀 Deployment

### Production Build (Frontend)

```bash
npm run build
```

### Start Backend Server

```bash
cd server
npm start
```

### Hosting

* Frontend → [Vercel](https://vercel.com/)
* Backend → [Render](https://render.com/) or any Node.js hosting service

---

## 🙌 Contributing

Contributions are welcome and appreciated!

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add new feature"`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.
See [`server/package.json`](server/package.json) for more info.

---

## 👨‍💻 Author

**Harsh Kumar** – [@CodeHarshh](https://github.com/CodeHarshh)

---

> Built with ❤️ to empower education through technology.

---

