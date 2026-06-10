from pydantic import BaseModel
from pydantic import Field

from typing import Optional
from datetime import datetime


class PosterResponse(BaseModel):

    id: str

    slug: str

    title: str

    description: Optional[str] = None

    status: str

    created_at: Optional[datetime] = None

    updated_at: Optional[datetime] = None


class PosterUpdate(BaseModel):

    title: str = Field(
        min_length=1,
        max_length=255
    )

    description: Optional[str] = None

    status: str = "ACTIVE"


class PosterListResponse(BaseModel):

    posters: list[PosterResponse]