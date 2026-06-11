from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException
)

from bson import ObjectId

from db import posters_collection
from db import sections_collection

from utils.file_utils import (
    validate_poster_file,
    validate_audio_file,
    save_upload_file
)

from utils.qr import generate_qr_code

from datetime import datetime
from db import get_next_sequence
import uuid
import os


router = APIRouter(
    prefix="/api/posters",
    tags=["Posters"]
)


@router.get("")
def get_posters():

    posters = []

    for poster in posters_collection.find():

        poster["id"] = str(
            poster["_id"]
        )

        del poster["_id"]

        posters.append(
            poster
        )

    return posters


@router.get("/{poster_id}")
def get_poster(
    poster_id: str
):

    poster = posters_collection.find_one({
        "_id": ObjectId(
            poster_id
        )
    })

    if not poster:

        raise HTTPException(
            status_code=404,
            detail="Poster not found"
        )

    poster["id"] = str(
        poster["_id"]
    )

    del poster["_id"]

    return poster

@router.post("")
async def create_poster(

    slug: str = Form(...),

    title: str = Form(...),

    description: str = Form(""),

    poster_file: UploadFile = File(...),

    audio_file: UploadFile = File(...)
):

    validate_poster_file(
        poster_file
    )

    validate_audio_file(
        audio_file
    )

    poster_path = await save_upload_file(
        poster_file,
        "uploads/posters"
    )

    audio_path = await save_upload_file(
        audio_file,
        "uploads/audio"
    )

    qr_filename = (
        f"{uuid.uuid4()}.png"
    )

    qr_path = os.path.join(
        "uploads/qrcodes",
        qr_filename
    )

    generate_qr_code(
        f"/poster/{slug}",
        qr_path
    )

    poster_id = get_next_sequence(
        "poster_id"
    )

    result = posters_collection.insert_one({

        "poster_id": poster_id,

        "slug": slug,

        "title": title,

        "description": description,

        "poster_file": poster_path,

        "audio_file": audio_path,

        "qr_file": qr_path,

        "status": "ACTIVE",

        "created_at": datetime.utcnow()
    })

    return {

        "message": "Poster created",

        "poster_id": poster_id,

        "mongo_id": str(
            result.inserted_id
        )
    }
@router.delete("/{poster_id}")
def delete_poster(
    poster_id: str
):

    poster = posters_collection.find_one({

        "_id": ObjectId(
            poster_id
        )
    })

    if not poster:

        raise HTTPException(
            status_code=404,
            detail="Poster not found"
        )

    for path in [

        poster.get(
            "poster_file"
        ),

        poster.get(
            "audio_file"
        ),

        poster.get(
            "qr_file"
        )
    ]:

        if (
            path and
            os.path.exists(path)
        ):

            os.remove(
                path
            )

    sections_collection.delete_many({

        "poster_id": poster_id
    })

    posters_collection.delete_one({

        "_id": ObjectId(
            poster_id
        )
    })

    return {

        "message": "Poster deleted"
    }