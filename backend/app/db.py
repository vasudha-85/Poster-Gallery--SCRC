# db.py

import os
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv

load_dotenv()

DB_NAME = os.getenv("DB_NAME", "poster_gallery")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")


# =========================
# CREATE DATABASE IF NOT EXISTS
# =========================

def create_database():
    conn = psycopg2.connect(
        dbname="postgres",  # connect to default db
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )

    conn.autocommit = True
    cursor = conn.cursor()

    cursor.execute(
        "SELECT 1 FROM pg_database WHERE datname = %s",
        (DB_NAME,)
    )

    exists = cursor.fetchone()

    if not exists:
        cursor.execute(
            sql.SQL("CREATE DATABASE {}").format(
                sql.Identifier(DB_NAME)
            )
        )
        print(f"✅ Database '{DB_NAME}' created")
    else:
        print(f"ℹ️ Database '{DB_NAME}' already exists")

    cursor.close()
    conn.close()


# =========================
# CONNECT TO PROJECT DB
# =========================

def get_connection():
    return psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )


# =========================
# CREATE TABLES
# =========================

def create_tables():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS posters (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    print("✅ posters table ready")

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS poster_media (
        id SERIAL PRIMARY KEY,
        poster_id INTEGER NOT NULL,
        media_type VARCHAR(30) NOT NULL,
        file_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        mime_type TEXT,
        file_size BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_poster_media
        FOREIGN KEY (poster_id)
        REFERENCES posters(id)
        ON DELETE CASCADE
    );
    """)
    print("✅ poster_media table ready")

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sections (
        id SERIAL PRIMARY KEY,
        poster_id INTEGER NOT NULL,
        section_name VARCHAR(255),
        shape VARCHAR(30) NOT NULL,
        x NUMERIC(8,2) NOT NULL,
        y NUMERIC(8,2) NOT NULL,
        width NUMERIC(8,2),
        height NUMERIC(8,2),
        radius NUMERIC(8,2),
        color VARCHAR(20) DEFAULT '#0ea5e9',
        opacity NUMERIC(4,2) DEFAULT 0.40,
        start_time NUMERIC(10,2) NOT NULL,
        end_time NUMERIC(10,2) NOT NULL,
        display_order INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_sections
        FOREIGN KEY (poster_id)
        REFERENCES posters(id)
        ON DELETE CASCADE
    );
    """)
    print("✅ sections table ready")

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        poster_id INTEGER,
        action VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_audit_logs
        FOREIGN KEY (poster_id)
        REFERENCES posters(id)
        ON DELETE CASCADE
    );
    """)
    print("✅ audit_logs table ready")

    conn.commit()

    cursor.close()
    conn.close()

    print("✅ Database tables created successfully")


# =========================
# RUN
# =========================

if __name__ == "__main__":

    try:
        print("🚀 Running DB setup...")

        create_database()
        create_tables()

        print("✅ Setup completed")

    except Exception as e:
        print(f"❌ Setup failed: {e}")