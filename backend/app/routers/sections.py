from fastapi import APIRouter, Depends
from db import get_connection
from schemas.section import SectionCreate


router = APIRouter(prefix="/api/sections", tags=["Sections"])


@router.get("/{poster_id}")
def get_sections(poster_id: str):

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT * FROM sections
        WHERE poster_id = %s
        ORDER BY start_time
    """, (poster_id,))

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return rows


@router.post("/{poster_id}")
def create_section(
    poster_id: str,
    payload: SectionCreate,
    
):

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO sections (
            poster_id,
            section_name,
            shape,
            x,
            y,
            width,
            height,
            radius,
            color,
            opacity,
            start_time,
            end_time,
            display_order
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        RETURNING *
    """, (
        poster_id,
        payload.section_name,
        payload.shape,
        payload.x,
        payload.y,
        payload.width,
        payload.height,
        payload.radius,
        payload.color,
        payload.opacity,
        payload.start_time,
        payload.end_time,
        payload.display_order
    ))

    row = cur.fetchone()

    conn.commit()
    cur.close()
    conn.close()

    return row


@router.delete("/{section_id}")
def delete_section(section_id: str):

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        DELETE FROM sections WHERE id = %s
    """, (section_id,))

    conn.commit()
    cur.close()
    conn.close()

    return {"message": "Section deleted"}