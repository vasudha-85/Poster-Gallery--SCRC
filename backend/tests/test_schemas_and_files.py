import pytest
from fastapi import HTTPException, UploadFile
from io import BytesIO

from app.schemas.section import SectionCreate
from app.utils.file_utils import get_extension, generate_filename, validate_audio_file, validate_poster_file, save_upload_file


def section(**updates):
    data = dict(section_name="Intro", shape="rectangle", x=10, y=20, startTime=0, endTime=10)
    data.update(updates)
    return SectionCreate(**data)


@pytest.mark.parametrize("field,value", [("shape", "triangle"), ("opacity", -0.1), ("opacity", 1.1), ("x", -1), ("y", 101), ("endTime", 0)])
def test_section_rejects_invalid_geometry_and_timing(field, value):
    with pytest.raises(ValueError):
        section(**{field: value})


def test_section_accepts_optional_dimensions_and_valid_limits():
    model = section(x=0, y=100, opacity=1)
    assert model.width is None and model.height is None and model.color == "#0ea5e9"


@pytest.mark.parametrize("name,valid", [("poster.PNG", True), ("file.pdf", True), ("movie.gif", False), ("track.m4a", True), ("track.ogg", False)])
def test_file_validation_uses_allowed_extensions(name, valid):
    upload = UploadFile(filename=name, file=BytesIO(b"data"))
    validator = validate_audio_file if name.endswith(("m4a", "ogg")) else validate_poster_file
    if valid:
        assert validator(upload) is None
    else:
        with pytest.raises(HTTPException) as error:
            validator(upload)
        assert error.value.status_code == 400


def test_extension_and_upload_persistence(monkeypatch):
    import app.utils.file_utils as file_utils
    assert get_extension("image.JpG") == ".jpg"
    name = generate_filename("image.JpG")
    assert name.endswith(".jpg") and len(name) > 36
    upload = UploadFile(filename="poster.png", file=BytesIO(b"image-bytes"))
    writes = []
    class AsyncWriter:
        async def __aenter__(self):
            return self
        async def __aexit__(self, *args):
            return None
        async def write(self, contents):
            writes.append(contents)
    async def fake_open_file(path, mode):
        assert path.startswith("virtual/uploads/")
        assert mode == "wb"
        return AsyncWriter()
    monkeypatch.setattr(file_utils.os, "makedirs", lambda *args, **kwargs: None)
    monkeypatch.setattr(file_utils.anyio, "open_file", fake_open_file)
    path = __import__("asyncio").run(save_upload_file(upload, "virtual/uploads"))
    assert path.endswith(".png")
    assert writes == [b"image-bytes"]


def test_qr_generation_configures_code_and_saves_output(monkeypatch):
    import app.utils.qr as qr_module
    calls = []
    class FakeImage:
        def save(self, path):
            calls.append(("save", path))
    class FakeCode:
        def __init__(self, **kwargs):
            calls.append(("init", kwargs))
        def add_data(self, value):
            calls.append(("data", value))
        def make(self, **kwargs):
            calls.append(("make", kwargs))
        def make_image(self, **kwargs):
            calls.append(("image", kwargs))
            return FakeImage()
    monkeypatch.setattr(qr_module, "qrcode", type("QR", (), {"QRCode": FakeCode}))
    monkeypatch.setattr(qr_module.os, "makedirs", lambda path, exist_ok: calls.append(("mkdir", path, exist_ok)))
    assert qr_module.generate_qr_code("https://gallery.test/p/1", "virtual/qr.png") == "virtual/qr.png"
    assert ("data", "https://gallery.test/p/1") in calls
    assert ("save", "virtual/qr.png") in calls


def test_pdf_thumbnail_renders_first_page_and_closes(monkeypatch):
    import app.utils.pdf_thumbnail as pdf_module
    calls = []
    class Pixmap:
        def save(self, path):
            calls.append(("save", path))
    class Page:
        def get_pixmap(self, matrix):
            calls.append(("matrix", matrix))
            return Pixmap()
    class Document:
        def load_page(self, index):
            calls.append(("page", index))
            return Page()
        def close(self):
            calls.append(("close",))
    monkeypatch.setattr(pdf_module.fitz, "open", lambda path: (calls.append(("open", path)) or Document()))
    output = pdf_module.generate_pdf_thumbnail("poster.pdf", "thumb.png")
    assert output == "thumb.png"
    assert ("open", "poster.pdf") in calls and ("page", 0) in calls
    assert ("save", "thumb.png") in calls and ("close",) in calls
