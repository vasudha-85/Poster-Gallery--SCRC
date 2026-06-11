from fastapi import (
    APIRouter,
    HTTPException
)

from bson import ObjectId

from db import sections_collection

from schemas.section import (
    SectionCreate
)


router = APIRouter(
    prefix="/api/sections",
    tags=["Sections"]
)


@router.get("/{poster_id}")
def get_sections(
    poster_id: str
):

    sections = []

    cursor = sections_collection.find({

        "poster_id": poster_id

    }).sort(
        "display_order",
        1
    )

    for section in cursor:

        section["id"] = str(
            section["_id"]
        )

        del section["_id"]

        sections.append(
            section
        )

    return sections


@router.post("/{poster_id}")
def create_section(

    poster_id: str,

    payload: SectionCreate
):

    result = sections_collection.insert_one({

        "poster_id": poster_id,

        "section_name":
            payload.section_name,

        "shape":
            payload.shape,

        "x":
            payload.x,

        "y":
            payload.y,

        "width":
            payload.width,

        "height":
            payload.height,

        "radius":
            payload.radius,

        "color":
            payload.color,

        "opacity":
            payload.opacity,

        "start_time":
            payload.start_time,

        "end_time":
            payload.end_time,

        "display_order":
            payload.display_order
    })

    return {

        "message":
            "Section created",

        "section_id":
            str(
                result.inserted_id
            )
    }


@router.delete("/{section_id}")
def delete_section(
    section_id: str
):

    result = sections_collection.delete_one({

        "_id": ObjectId(
            section_id
        )
    })

    if result.deleted_count == 0:

        raise HTTPException(

            status_code=404,

            detail="Section not found"
        )

    return {

        "message":
            "Section deleted"
    }