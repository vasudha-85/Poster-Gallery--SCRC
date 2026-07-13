from fastapi import (
    APIRouter,
    HTTPException,
    Form,
    File,
    UploadFile
)
import os
from bson import ObjectId
from pydantic import BaseModel

from app.db import sections_collection
from app.schemas.section import SectionCreate
from app.utils.file_utils import (
    validate_audio_file,
    save_upload_file
)

router = APIRouter(
    tags=["Sections"]
)


def find_section_by_id(section_id: str):

    try:
        obj_id = ObjectId(section_id)

        section = sections_collection.find_one({
            "_id": obj_id
        })

        if section:
            return section

    except Exception:
        pass

    return None




# GET ALL SECTIONS FOR A POSTER
@router.get("/{poster_id}")
def get_sections(
    poster_id: str
):

    sections = []

    cursor = []

    for section in sections_collection.find():

        if section.get("poster_id") == poster_id:
            cursor.append(section)


    cursor.sort(
        key=lambda x: x.get("display_order", 0)
    )


    for section in cursor:

        section["id"] = str(
            section["_id"]
        )
        section.pop("_id", None)          # <-- Add this

        # Convert snake_case -> camelCase
        section["label"] = section.pop("section_name", "")
        section["startTime"] = section.pop("startTime", 0)
        section["endTime"] = section.pop("endTime", 0) 
        section["fade_in"] = section.get("fade_in",0)

        section["fade_out"] = section.get("fade_out",0)

        section["volume"] = section.get("volume",1)

        section["audio_file"] = section.get("audio_file")
        section.pop("poster_id", None)
        sections.append(section)


    return sections




# CREATE SECTION
@router.post("/{poster_id}")
def create_section(
    poster_id: str,
    payload: SectionCreate
):

    result = sections_collection.insert_one({

        "poster_id": poster_id,

        "section_name": payload.section_name,

        "shape": payload.shape,

        "x": payload.x,

        "y": payload.y,

        "width": payload.width,

        "height": payload.height,

        "radius": payload.radius,

        "color": payload.color,

        "opacity": payload.opacity,

        "startTime": payload.startTime,

        "endTime": payload.endTime,

        "display_order": payload.display_order
    })


    return {

        "message": "Section created",

        "section_id": str(
            result.inserted_id
        )
    }




# DELETE SECTION
@router.delete("/section/{section_id}")
def delete_section(
    section_id: str
):

    section = find_section_by_id(section_id)


    if not section:

        raise HTTPException(
            status_code=404,
            detail="Section not found"
        )


    sections_collection.delete_one({

        "_id": section["_id"]

    })


    return {

        "message": "Section deleted"

    }





# UPDATE SECTION AUDIO
@router.put("/section/{section_id}")
async def update_section(

    section_id: str,

    startTime: float = Form(...),

    endTime: float = Form(...),

    fade_in: float = Form(0),

    fade_out: float = Form(0),

    volume: float = Form(1),

    audio_file: UploadFile | None = File(None)
):

    section = find_section_by_id(section_id)

    if not section:
        raise HTTPException(
            status_code=404,
            detail="Section not found"
        )

    update_data = {

        "startTime": startTime,

        "endTime": endTime,

        "fade_in": fade_in,

        "fade_out": fade_out,

        "volume": volume
    }

    if audio_file and audio_file.filename:

        validate_audio_file(audio_file)

        old_audio = section.get("audio_file")

        if old_audio and os.path.exists(old_audio):
            os.remove(old_audio)

        audio_path = await save_upload_file(
            audio_file,
            "uploads/audio"
        )

        update_data["audio_file"] = audio_path

    sections_collection.update_one(
        {
            "_id": section["_id"]
        },
        {
            "$set": update_data
        }
    )

    return {
        "message": "Section updated successfully"
    }
from bson import ObjectId
from typing import List

@router.put("/{poster_id}/sync")
def sync_sections(
    poster_id: str,
    payload: List[SectionCreate]
):

    incoming_ids = []

    for section in payload:

        # Existing section
        if section.id:
            incoming_ids.append(ObjectId(section.id))

            sections_collection.update_one(
                {
                    "_id": ObjectId(section.id)
                },
                {
                    "$set": {
                        "section_name": section.section_name,
                        "shape": section.shape,
                        "x": section.x,
                        "y": section.y,
                        "width": section.width,
                        "height": section.height,
                        "radius": section.radius,
                        "color": section.color,
                        "opacity": section.opacity,
                        "startTime": section.startTime,
                        "endTime": section.endTime,
                        "display_order": section.display_order,
                    }
                }
            )

        # New section
        else:

            result = sections_collection.insert_one({
                "poster_id": poster_id,
                "section_name": section.section_name,
                "shape": section.shape,
                "x": section.x,
                "y": section.y,
                "width": section.width,
                "height": section.height,
                "radius": section.radius,
                "color": section.color,
                "opacity": section.opacity,
                "startTime": section.startTime,
                "endTime": section.endTime,
                "display_order": section.display_order,
            })

            incoming_ids.append(result.inserted_id)

    # Remove deleted sections
    sections_collection.delete_many({
        "poster_id": poster_id,
        "_id": {
            "$nin": incoming_ids
        }
    })

    return {
        "message": "Sections synchronized successfully"
    }