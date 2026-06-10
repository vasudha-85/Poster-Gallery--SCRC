from fastapi import APIRouter, UploadFile, File, Form, Depends
from db import get_connection


router = APIRouter(prefix="/api/posters", tags=["Posters"])


@router.get("")
def get_posters():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT * FROM posters
        ORDER BY created_at DESC
    """)

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return rows


@router.post("")
def create_poster(
    slug: str = Form(...),
    title: str = Form(...),
    description: str = Form(""),
    poster_file: UploadFile = File(...),
    audio_file: UploadFile = File(...),
    
):

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO posters (slug, title, description)
        VALUES (%s, %s, %s)
        RETURNING id, slug, title, description
    """, (slug, title, description))

    poster = cur.fetchone()

    conn.commit()
    cur.close()
    conn.close()

    return {"message": "Poster created", "poster": poster}


@router.delete("/{poster_id}")
def delete_poster(poster_id: str, ):

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        DELETE FROM posters WHERE id = %s
    """, (poster_id,))

    conn.commit()
    cur.close()
    conn.close()

    return {"message": "Poster deleted"}