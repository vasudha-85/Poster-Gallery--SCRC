from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException
)
from bson import ObjectId

from app.db import posters_collection
from app.db import sections_collection
from app.utils.file_utils import (
    validate_poster_file,
    validate_audio_file,
    save_upload_file
)
from app.utils.qr import generate_qr_code
from app.utils.pdf_thumbnail import generate_pdf_thumbnail
from datetime import datetime
from app.db import get_next_sequence
import uuid
import os
from typing import Optional



router = APIRouter(
    tags=["Posters"]
)


import re

def generate_slug(title: str) -> str:
    slug = title.lower().strip()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    slug = slug.strip('-')
    return slug

def find_poster_by_any_id(poster_id: str):
    poster = None

    if str(poster_id).isdigit():
        poster = posters_collection.find_one({
            "poster_id": str(poster_id)
        })
        if poster:
            return poster

    # Try MongoDB ObjectId if the storage supports it
    try:
        object_id = ObjectId(poster_id)
    except Exception:
        object_id = None

    if object_id is not None:
        poster = posters_collection.find_one({
            "_id": object_id
        })
        if poster:
            return poster

    poster = posters_collection.find_one({
        "_id": poster_id
    })
    if poster:
        return poster

    poster = posters_collection.find_one({
        "poster_id": poster_id
    })
    if poster:
        return poster

    return None


    
@router.get("")
def get_posters():

    posters = []

    for poster in posters_collection.find():

        mongo_id = str(poster.get("_id"))

        poster["id"] = mongo_id

        poster["sectionCount"] = sections_collection.count_documents({
            "poster_id": poster.get("poster_id", mongo_id)
        })

        poster["audioStatus"] = (
            "ready"
            if poster.get("audio_file")
            else "missing"
        )

        # Fix Windows paths
        for field in [
            "poster_file",
            "audio_file",
            "qr_file",
            "thumbnail_file"
        ]:
            if poster.get(field):
                poster[field] = poster[field].replace("\\", "/")

        poster.pop("_id", None)

        posters.append(poster)

    return posters

@router.get("/slug/{slug}")
def get_poster_by_slug(slug: str):
    poster = posters_collection.find_one({"slug": slug})
    if not poster:
        raise HTTPException(
            status_code=404,
            detail="Poster not found"
        )
    poster["id"] = str(poster.get("_id", ""))
    poster.pop("_id", None)
    return poster

@router.get("/{poster_id}")
def get_poster(poster_id: str):

    poster = find_poster_by_any_id(poster_id)

    if not poster:
        raise HTTPException(
            status_code=404,
            detail="Poster not found"
        )

    mongo_id = str(poster["_id"])

    response = {
        **poster,
        "id": mongo_id,
        "sectionCount": sections_collection.count_documents({
            "poster_id": poster.get("poster_id", mongo_id)
        }),
        "audioStatus": "ready" if poster.get("audio_file") else "missing"
    }

    response.pop("_id", None)

    for field in [
        "poster_file",
        "audio_file",
        "qr_file",
        "thumbnail_file",
    ]:
        if response.get(field):
            response[field] = response[field].replace("\\", "/")

    return response
@router.post("")
async def create_poster(

    title: str = Form(...),
    description: str = Form(""),
    poster_file: UploadFile = File(...),
    audio_file: Optional[UploadFile] = File(None)
):
    slug = generate_slug(title)

    if not poster_file or not poster_file.filename:
        raise HTTPException(
            status_code=400,
            detail="Poster file is required and must be uploaded."
        )

    validate_poster_file(poster_file)
    
    poster_path = await save_upload_file(
        poster_file,
        "uploads/posters"
    )

    audio_path = None

    if audio_file and audio_file.filename:
       validate_audio_file(audio_file)

       audio_path = await save_upload_file(
          audio_file,
          "uploads/audio"
       )

    # Check if PDF and generate thumbnail if so
    thumbnail_path = None
    extension = os.path.splitext(poster_path)[1].lower()
    if extension == ".pdf":
        thumbnail_filename = f"{uuid.uuid4()}.png"
        thumbnail_path = os.path.join("uploads/thumbnails", thumbnail_filename)
        os.makedirs("uploads/thumbnails", exist_ok=True)
        try:
            generate_pdf_thumbnail(poster_path, thumbnail_path)
        except Exception as e:
            # Fallback to None if library is not fully configured
            print(f"Error generating PDF thumbnail: {e}")
            thumbnail_path = None

    qr_filename = f"{uuid.uuid4()}.png"
    qr_path = os.path.join(
        "uploads/qrcodes",
        qr_filename
    )

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    generate_qr_code(
        f"{frontend_url}/poster/{slug}",
        qr_path
    )

    poster_id = get_next_sequence("poster_id")

    result = posters_collection.insert_one({
        "poster_id": poster_id,
        "slug": slug,
        "title": title,
        "description": description,
        "poster_file": poster_path,
        "audio_file": audio_path,
        "qr_file": qr_path,
        "thumbnail_file": thumbnail_path,
        "status": "ACTIVE",
        "created_at": datetime.utcnow()
    })

    return {
        "message": "Poster created",
        "poster_id": poster_id,
        "mongo_id": str(result.inserted_id)
    }


from fastapi.responses import FileResponse

@router.get("/download-qr/{poster_id}")
def download_qr(poster_id: str):
    poster = find_poster_by_any_id(poster_id)

    if not poster:
        raise HTTPException(
            status_code=404,
            detail="Poster not found"
        )

    qr_path = poster.get("qr_file")

    if not qr_path or not os.path.exists(qr_path):
        raise HTTPException(
            status_code=404,
            detail="QR file not found"
        )

    return FileResponse(
        path=qr_path,
        media_type="image/png",
        filename=f"{poster['slug']}.png"
    )

@router.delete("/{poster_id}")
def delete_poster(poster_id: str):
    poster = find_poster_by_any_id(poster_id)

    if not poster:
        raise HTTPException(
            status_code=404,
            detail="Poster not found"
        )

    for path in [
        poster.get("poster_file"),
        poster.get("audio_file"),
        poster.get("qr_file"),
        poster.get("thumbnail_file")
    ]:
        if path and os.path.exists(path):
            try:
                os.remove(path)
            except Exception as e:
                print(f"Error removing file {path}: {e}")

    sections_collection.delete_many({
       "poster_id": poster.get("poster_id")
    })

    posters_collection.delete_one({
       "_id": poster["_id"]
    })

    return {
        "message": "Poster deleted"
    }
@router.put("/{poster_id}")
async def update_poster(
    poster_id: str,
    title: str = Form(...),
    description: str = Form(""),
    poster_file: Optional[UploadFile] = File(None),
    audio_file: Optional[UploadFile] = File(None)
):
    slug = generate_slug(title)

    poster = find_poster_by_any_id(poster_id)
    if not poster:
        raise HTTPException(
            status_code=404,
            detail="Poster not found"
        )

    # Regenerate QR if slug changed
    if poster.get("slug") != slug:
        qr_path = poster.get("qr_file")
        if qr_path and os.path.exists(qr_path):
            try:
                os.remove(qr_path)
            except Exception:
                pass

        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        generate_qr_code(
            f"{frontend_url}/poster/{slug}",
            qr_path
        )

    # Update text fields
    poster["slug"] = slug
    poster["title"] = title
    poster["description"] = description

   # Replace poster file (if uploaded)
    if poster_file and poster_file.filename:

     validate_poster_file(poster_file)

    # Delete old poster file
     old_file = poster.get("poster_file")
     if old_file and os.path.exists(old_file):
        os.remove(old_file)

    # Delete old thumbnail if it exists
    old_thumbnail = poster.get("thumbnail_file")
    if old_thumbnail and os.path.exists(old_thumbnail):
        os.remove(old_thumbnail)
        poster["thumbnail_file"] = None

    # Save new poster
    poster_path = await save_upload_file(
        poster_file,
        "uploads/posters"
    )

    poster["poster_file"] = poster_path

    # Generate thumbnail only for PDF
    extension = os.path.splitext(poster_path)[1].lower()

    if extension == ".pdf":
        thumbnail_filename = f"{uuid.uuid4()}.png"
        thumbnail_path = os.path.join(
            "uploads/thumbnails",
            thumbnail_filename
        )

        os.makedirs("uploads/thumbnails", exist_ok=True)

        try:
            generate_pdf_thumbnail(
                poster_path,
                thumbnail_path
            )
            poster["thumbnail_file"] = thumbnail_path
        except Exception as e:
            print(f"Error generating PDF thumbnail: {e}")
            poster["thumbnail_file"] = None
    else:
        # Image files don't need thumbnails
        poster["thumbnail_file"] = None
# Save changes to MongoDB
    posters_collection.update_one(
        {"_id": poster["_id"]},
        {"$set": {
            "slug": poster["slug"],
            "title": poster["title"],
            "description": poster["description"],
            "poster_file": poster.get("poster_file"),
            "audio_file": poster.get("audio_file"),
            "thumbnail_file": poster.get("thumbnail_file"),
            "updated_at": poster["updated_at"],
    }}
)
    return {
        "message": "Poster updated successfully."
    }

