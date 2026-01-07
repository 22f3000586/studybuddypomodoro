# 🐻 Study Buddy Pomodoro

A cute, mobile-friendly Pomodoro timer web application with a virtual study companion.  
The app helps users stay focused using the Pomodoro technique while providing emotional motivation through different study buddy personalities.

🌐 **Live Demo:** https://studybuddypomodoro.onrender.com/

---

## ✨ Features

- ⏱️ Classic Pomodoro Timer (Study / Break)
- 🛠️ Custom study and break duration
- 🐻 Virtual Study Buddy with multiple personalities:
  - Soft & Kind 🩷  
  - Strict Motivator 🔥  
  - Funny 😆  
  - Senpai 👀
- 👤 Username-based multi-user support (no passwords)
- 📊 Daily session tracking
- 🔥 Productivity streak system
- 💾 Persistent data using SQLite
- 📱 Fully mobile-friendly UI
- 🌍 Deployed online using Render

---

## 🧠 How It Works

- Users enter a **unique username** (stored locally in the browser).
- Each completed **study session** is saved per user per day.
- A **streak** increases only when the user completes at least one session on consecutive days.
- Data is stored using a **composite primary key (username, day)** to support multiple users.
- The virtual study buddy reacts dynamically based on study or break state.

---

## 🛠️ Tech Stack

**Frontend**
- HTML
- CSS
- JavaScript

**Backend**
- Python (Flask)
- SQLite

**Deployment**
- Gunicorn (WSGI server)
- Render (Free Tier)

---

## 🗂️ Project Structure

study-buddy-pomodoro/
│
├── app.py
├── requirements.txt
├── README.md
│
├── templates/
│ └── index.html
│
├── static/
│ ├── css/
│ │ └── style.css
│ ├── js/
│ │ └── timer.js
│ ├── images/
│ │ ├── bear_soft.jpeg
│ │ ├── bear_strict.jpeg
│ │ ├── bear_funny.jpeg
│ │ └── bear_senpai.jpeg
│ └── sounds/
│ └── ding.mp3


---

## ▶️ Run Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install flask

Run the app:
python app.py

Open in browser:
http://127.0.0.1:5000/
