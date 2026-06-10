from pydantic import BaseModel
from pydantic import Field
from pydantic import field_validator

from typing import Optional


class SectionCreate(BaseModel):

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

    start_time: float

    end_time: float

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

    @field_validator("end_time")
    @classmethod
    def validate_end_time(
        cls,
        value,
        info
    ):

        start_time = info.data.get(
            "start_time"
        )

        if (
            start_time is not None
            and value <= start_time
        ):

            raise ValueError(
                "end_time must be greater than start_time"
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

    start_time: float

    end_time: float

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

    start_time: Optional[float] = None

    end_time: Optional[float] = None

    display_order: Optional[int] = None