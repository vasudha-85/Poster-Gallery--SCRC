import os
import uuid

from fastapi import UploadFile
from fastapi import HTTPException


IMAGE_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg"
}

PDF_EXTENSIONS = {
    ".pdf"
}

AUDIO_EXTENSIONS = {
    ".mp3",
    ".wav",
    ".aac"
}


def get_extension(
    filename: str
) -> str:

    return os.path.splitext(
        filename
    )[1].lower()


def validate_poster_file(
    file: UploadFile
):

    extension = get_extension(
        file.filename
    )

    allowed = (
        IMAGE_EXTENSIONS |
        PDF_EXTENSIONS
    )

    if extension not in allowed:

        raise HTTPException(
            status_code=400,
            detail=(
                "Poster must be "
                "PNG, JPG, JPEG or PDF"
            )
        )


def validate_audio_file(
    file: UploadFile
):

    extension = get_extension(
        file.filename
    )

    if extension not in AUDIO_EXTENSIONS:

        raise HTTPException(
            status_code=400,
            detail=(
                "Audio must be "
                "MP3, WAV or AAC"
            )
        )


def generate_filename(
    filename: str
) -> str:

    extension = get_extension(
        filename
    )

    return (
        f"{uuid.uuid4()}"
        f"{extension}"
    )


async def save_upload_file(
    file: UploadFile,
    folder: str
) -> str:

    os.makedirs(
        folder,
        exist_ok=True
    )

    safe_name = generate_filename(
        file.filename
    )

    file_path = os.path.join(
        folder,
        safe_name
    )

    contents = await file.read()

    with open(
        file_path,
        "wb"
    ) as f:

        f.write(contents)

    return file_path