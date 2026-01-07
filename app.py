from flask import Flask, render_template, request, jsonify
import sqlite3
from datetime import date, timedelta

app = Flask(__name__)
DB = "database.db"


def get_db():
    return sqlite3.connect(DB)


def init_db():
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS daily_stats (
            username TEXT,
            day TEXT,
            sessions INTEGER DEFAULT 0,
            streak INTEGER DEFAULT 0,
            total_sessions INTEGER DEFAULT 0,
            buddy TEXT,
            PRIMARY KEY (username, day)
        )
    """)
    conn.commit()
    conn.close()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/stats", methods=["GET"])
def get_stats():
    username = request.args.get("username")

    if not username:
        return jsonify({
            "sessions": 0,
            "streak": 0,
            "total": 0,
            "buddy": "soft"
        })

    today = date.today().isoformat()
    conn = get_db()
    c = conn.cursor()

    c.execute("""
        SELECT sessions, streak, total_sessions, buddy
        FROM daily_stats
        WHERE username=? AND day=?
    """, (username, today))

    row = c.fetchone()
    conn.close()

    if row:
        sessions, streak, total, buddy = row
    else:
        sessions, streak, total, buddy = 0, 0, 0, "soft"

    return jsonify({
        "sessions": sessions,
        "streak": streak,
        "total": total,
        "buddy": buddy
    })


@app.route("/complete", methods=["POST"])
def complete_session():
    data = request.get_json()
    if not data or "username" not in data:
        return jsonify({"sessions": 0, "streak": 0})

    username = data["username"]
    today = date.today().isoformat()
    yesterday = (date.today() - timedelta(days=1)).isoformat()

    conn = get_db()
    c = conn.cursor()

    c.execute("""
        SELECT sessions, streak, total_sessions
        FROM daily_stats
        WHERE username=? AND day=?
    """, (username, today))
    today_row = c.fetchone()

    c.execute("""
        SELECT streak FROM daily_stats
        WHERE username=? AND day=?
    """, (username, yesterday))
    yesterday_row = c.fetchone()

    if today_row:
        sessions, streak, total = today_row
        sessions += 1
        total += 1
    else:
        sessions = 1
        total = 1
        streak = yesterday_row[0] + 1 if yesterday_row else 1

    c.execute("""
        INSERT OR REPLACE INTO daily_stats
        (username, day, sessions, streak, total_sessions)
        VALUES (?, ?, ?, ?, ?)
    """, (username, today, sessions, streak, total))

    conn.commit()
    conn.close()

    return jsonify({
        "sessions": sessions,
        "streak": streak
    })


@app.route("/buddy", methods=["POST"])
def save_buddy():
    data = request.get_json()
    if not data:
        return jsonify({"status": "ignored"})

    username = data.get("username")
    buddy = data.get("buddy")
    today = date.today().isoformat()

    conn = get_db()
    c = conn.cursor()
    c.execute("""
        INSERT INTO daily_stats (username, day, buddy)
        VALUES (?, ?, ?)
        ON CONFLICT(username, day)
        DO UPDATE SET buddy=excluded.buddy
    """, (username, today, buddy))

    conn.commit()
    conn.close()
    return jsonify({"status": "saved"})


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=10000)

