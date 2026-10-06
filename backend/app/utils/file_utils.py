import os
import uuid
import anyio

from fastapi import UploadFile
from fastapi import HTTPException
import fitz

IMAGE_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg"
}

PDF_EXTENSIONS = {
    ".pdf"
}

# Removed .mp3, .wav, and .aac -> added .mp4 and .m4a
AUDIO_EXTENSIONS = {
    ".mp3",
    ".wav",
    ".aac",
    ".m4a",
    ".mp4"
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
                "Audio must be MP3, WAV, AAC, M4A, or MP4"
                
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
    ).replace("\\", "/")

    contents = await file.read()

    async with await anyio.open_file(file_path, "wb") as f:
        await f.write(contents)

    return file_path


def generate_pdf_thumbnail(
    pdf_path: str,
    thumbnail_path: str
):

    document = fitz.open(
        pdf_path
    )

    page = document.load_page(
        0
    )

    pix = page.get_pixmap(
        matrix=fitz.Matrix(
            2,
            2
        )
    )

    pix.save(
        thumbnail_path
    )

    document.close()

    return thumbnail_path
