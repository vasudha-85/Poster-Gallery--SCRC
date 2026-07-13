from pydantic import BaseModel
from pydantic import Field
from pydantic import field_validator

from typing import Optional


class SectionCreate(BaseModel):
    id: Optional[str] = None
    section_name: str = Field(
        min_length=1,
        max_length=255
    )

    shape: str

    x: float
    y: float

    width: Optional[float] = None
    height: Optional[float] = None

    radius: Optional[float] = None

    color: str = "#0ea5e9"

    opacity: float = 0.4

    startTime: float

    endTime: float

    display_order: int = 1

    @field_validator("shape")
    @classmethod
    def validate_shape(
        cls,
        value
    ):

        allowed = [
            "rectangle",
            "circle"
        ]

        if value not in allowed:

            raise ValueError(
                "Shape must be rectangle or circle"
            )

        return value

    @field_validator("opacity")
    @classmethod
    def validate_opacity(
        cls,
        value
    ):

        if value < 0:
            raise ValueError(
                "Opacity cannot be less than 0"
            )

        if value > 1:
            raise ValueError(
                "Opacity cannot be greater than 1"
            )

        return value

    @field_validator("x", "y")
    @classmethod
    def validate_coordinates(
        cls,
        value
    ):

        if value < 0:
            raise ValueError(
                "Coordinates cannot be negative"
            )

        if value > 100:
            raise ValueError(
                "Coordinates must be percentage values between 0 and 100"
            )

        return value

    @field_validator("endTime")
    @classmethod
    def validate_endTime(
        cls,
        value,
        info
    ):

        startTime = info.data.get(
            "startTime"
        )

        if (
            startTime is not None
            and value <= startTime
        ):

            raise ValueError(
                "endTime must be greater than startTime"
            )

        return value


class SectionResponse(BaseModel):

    id: str

    poster_id: str

    section_name: str

    shape: str

    x: float

    y: float

    width: Optional[float] = None

    height: Optional[float] = None

    radius: Optional[float] = None

    color: str

    opacity: float

    startTime: float

    endTime: float

    display_order: int


class SectionUpdate(BaseModel):

    section_name: Optional[str] = None

    shape: Optional[str] = None

    x: Optional[float] = None

    y: Optional[float] = None

    width: Optional[float] = None

    height: Optional[float] = None

    radius: Optional[float] = None

    color: Optional[str] = None

    opacity: Optional[float] = None

    startTime: Optional[float] = None

    endTime: Optional[float] = None

    display_order: Optional[int] = None