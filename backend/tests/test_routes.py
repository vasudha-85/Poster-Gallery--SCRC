from io import BytesIO
from fastapi import UploadFile
from fastapi.testclient import TestClient
from bson import ObjectId
from datetime import datetime

from main import app
from app.db import posters_collection, sections_collection
from app.routers.posters import generate_slug, find_poster_by_any_id
from app.routers.sections import find_section_by_id
from app.schemas.section import SectionCreate

client = TestClient(app)


def test_health_and_cors():
    assert client.get("/health").json() == {"status": "ok"}
    response = client.get("/health", headers={"origin": "http://localhost:5173"})
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"


def test_slug_and_id_lookups():
    assert generate_slug("  Hello, World! ") == "hello-world"
    oid = ObjectId()
    posters_collection.insert_one({"_id": oid, "poster_id": "17", "slug": "sample"})
    assert find_poster_by_any_id("17")["_id"] == oid
    assert find_poster_by_any_id(str(oid))["_id"] == oid
    assert find_poster_by_any_id("sample") is None
    sid = ObjectId()
    sections_collection.insert_one({"_id": sid, "section_name": "A"})
    assert find_section_by_id(str(sid))["_id"] == sid
    assert find_section_by_id("bad-id") is None


def test_poster_list_slug_and_id_responses():
    oid = posters_collection.insert_one({"poster_id": "3", "slug": "three", "title": "Three", "poster_file": "a\\b.png", "audio_file": None}).inserted_id
    sections_collection.insert_one({"poster_id": "3"})
    assert client.get("/api/posters").json()[0]["sectionCount"] == 1
    assert client.get("/api/posters").status_code == 200
    assert client.get("/api/posters/slug/three").json()["id"] == str(oid)
    item = client.get("/api/posters/3").json()
    assert item["audioStatus"] == "missing" and item["poster_file"] == "a/b.png"
    assert client.get("/api/posters/not-found").status_code == 404
    assert client.get("/api/posters/slug/not-found").status_code == 404


def test_poster_create_upload_validation_and_success(monkeypatch):
    import app.routers.posters as routes
    async def fake_save(file, folder):
        return f"{folder}/saved.png"
    monkeypatch.setattr(routes, "save_upload_file", fake_save)
    monkeypatch.setattr(routes, "generate_qr_code", lambda url, path: None)
    response = client.post("/api/posters", data={"title": "A Test Poster", "description": "desc"}, files={"poster_file": ("poster.png", b"img", "image/png")})
    assert response.status_code == 200
    body = response.json()
    assert body["poster_id"] == "1"
    assert posters_collection.find_one({"slug": "a-test-poster"})["description"] == "desc"
    bad = client.post("/api/posters", data={"title": "bad"}, files={"poster_file": ("poster.gif", b"x", "image/gif")})
    assert bad.status_code == 400
    bad_audio = client.post("/api/posters", data={"title": "bad audio"}, files={"poster_file": ("poster.png", b"x", "image/png"), "audio_file": ("voice.ogg", b"x", "audio/ogg")})
    assert bad_audio.status_code == 400
    missing = client.post("/api/posters", data={"title": "missing"})
    assert missing.status_code == 422


def test_update_poster_text_and_image_and_missing_record(monkeypatch):
    import app.routers.posters as routes
    async def fake_save(file, folder):
        return f"{folder}/new.png"
    qr_calls = []
    monkeypatch.setattr(routes, "save_upload_file", fake_save)
    monkeypatch.setattr(routes, "generate_qr_code", lambda url, path: qr_calls.append((url, path)))
    monkeypatch.setattr(routes.os.path, "exists", lambda path: False)
    assert client.put("/api/posters/missing", data={"title": "Missing"}).status_code == 404
    oid = posters_collection.insert_one({"poster_id": "9", "slug": "before", "title": "Before", "description": "old", "poster_file": "old.png", "qr_file": "qr.png", "updated_at": datetime(2024, 1, 1)}).inserted_id
    response = client.put(f"/api/posters/{oid}", data={"title": "After Update", "description": "new"}, files={"poster_file": ("new.png", b"image", "image/png")})
    assert response.status_code == 200
    updated = posters_collection.find_one({"_id": oid})
    assert updated["slug"] == "after-update" and updated["poster_file"] == "uploads/posters/new.png"
    assert updated["updated_at"] == datetime(2024, 1, 1)
    assert qr_calls == [("http://localhost:5173/poster/after-update", "qr.png")]


def test_update_pdf_thumbnail_failure_falls_back_to_none(monkeypatch):
    import app.routers.posters as routes
    async def fake_save(file, folder):
        return "uploads/posters/new.pdf"
    monkeypatch.setattr(routes, "save_upload_file", fake_save)
    monkeypatch.setattr(routes, "generate_pdf_thumbnail", lambda *args: (_ for _ in ()).throw(RuntimeError("renderer unavailable")))
    monkeypatch.setattr(routes, "generate_qr_code", lambda *args: None)
    monkeypatch.setattr(routes.os.path, "exists", lambda path: False)
    monkeypatch.setattr(routes.os, "makedirs", lambda *args, **kwargs: None)
    oid = posters_collection.insert_one({"poster_id": "10", "slug": "pdf", "title": "PDF", "qr_file": "qr.png", "updated_at": datetime(2024, 1, 1)}).inserted_id
    response = client.put(f"/api/posters/{oid}", data={"title": "PDF Updated"}, files={"poster_file": ("new.pdf", b"pdf", "application/pdf")})
    assert response.status_code == 200
    assert posters_collection.find_one({"_id": oid})["thumbnail_file"] is None


def test_poster_qr_download_and_delete_cascade(monkeypatch):
    import app.routers.posters as routes
    from pathlib import Path
    qr = Path(__file__).resolve().parents[1] / "app" / "uploads" / "qrcodes" / "8f19b49b-4473-4184-a625-872ba8d57d1b.png"
    removed = []
    monkeypatch.setattr(routes.os, "remove", lambda path: removed.append(path))
    oid = posters_collection.insert_one({"poster_id": "8", "slug": "eight", "qr_file": str(qr), "poster_file": "missing-poster.png"}).inserted_id
    sections_collection.insert_one({"poster_id": "8"})
    assert client.get("/api/posters/download-qr/8").status_code == 200
    assert client.get("/api/posters/download-qr/999").status_code == 404
    assert client.delete(f"/api/posters/{oid}").json() == {"message": "Poster deleted"}
    assert str(qr) in removed
    assert sections_collection.count_documents({"poster_id": "8"}) == 0


def test_delete_continues_when_file_cleanup_fails(monkeypatch):
    import app.routers.posters as routes
    monkeypatch.setattr(routes.os.path, "exists", lambda path: True)
    monkeypatch.setattr(routes.os, "remove", lambda path: (_ for _ in ()).throw(OSError("locked")))
    oid = posters_collection.insert_one({"poster_id": "11", "slug": "locked", "poster_file": "locked.png"}).inserted_id
    response = client.delete(f"/api/posters/{oid}")
    assert response.status_code == 200
    assert posters_collection.find_one({"_id": oid}) is None


def test_sections_create_list_delete_and_not_found():
    payload = {"section_name": "Start", "shape": "circle", "x": 1, "y": 2, "startTime": 0, "endTime": 5}
    created = client.post("/api/sections/3", json=payload)
    assert created.status_code == 200
    sections = client.get("/api/sections/3").json()
    assert sections[0]["label"] == "Start"
    assert sections[0]["startTime"] == 0
    assert "poster_id" not in sections[0]
    assert client.post("/api/sections/3", json={**payload, "shape": "oval"}).status_code == 422
    section_id = created.json()["section_id"]
    assert client.delete(f"/api/sections/section/{section_id}").status_code == 200
    assert client.delete(f"/api/sections/section/{section_id}").status_code == 404


def test_sync_sections_updates_inserts_and_removes():
    oid = sections_collection.insert_one({"poster_id": "4", "section_name": "Old"}).inserted_id
    payload = [{"id": str(oid), "section_name": "Renamed", "shape": "rectangle", "x": 10, "y": 10, "startTime": 0, "endTime": 4}, {"section_name": "New", "shape": "circle", "x": 5, "y": 5, "startTime": 0, "endTime": 8}]
    response = client.put("/api/sections/4/sync", json=payload)
    assert response.status_code == 200
    assert sections_collection.count_documents({"poster_id": "4"}) == 2
    assert sections_collection.find_one({"_id": oid})["section_name"] == "Renamed"
    assert client.put("/api/sections/4/sync", json=[]).status_code == 200
    assert sections_collection.count_documents({"poster_id": "4"}) == 0


def test_section_audio_update_requires_section_and_valid_audio(monkeypatch):
    async def fake_save(file, folder):
        return "uploads/audio/new.mp3"
    assert client.put("/api/sections/section/missing", data={"startTime": 0, "endTime": 2}).status_code == 404
    oid = sections_collection.insert_one({"poster_id": "2", "audio_file": None}).inserted_id
    invalid = client.put(f"/api/sections/section/{oid}", data={"startTime": 0, "endTime": 2}, files={"audio_file": ("bad.txt", b"x", "text/plain")})
    assert invalid.status_code == 400
    monkeypatch.setattr("app.routers.sections.save_upload_file", fake_save)
    ok = client.put(f"/api/sections/section/{oid}", data={"startTime": 1, "endTime": 2, "volume": .5}, files={"audio_file": ("voice.mp3", b"mp3", "audio/mpeg")})
    assert ok.status_code == 200
    assert sections_collection.find_one({"_id": oid})["audio_file"] == "uploads/audio/new.mp3"


def test_mongo_store_operations_and_sequence():
    from app.db import MongoStore, MongoCountersStore
    store = MongoStore("mongodb://fake", "test", "records")
    store.insert_one({"id": "abc", "value": 1})
    assert store.find_one({"id": "abc"})["value"] == 1
    store.update_one({"id": "abc"}, {"value": 2})
    assert store.find({})[0]["value"] == 2 and store.count_documents() == 1
    store.save({"id": "abc", "value": 3})
    with __import__("pytest").raises(ValueError):
        store.save({"value": 4})
    store.insert_many([{"id": "b"}, {"id": "c"}])
    assert store.delete_one({"id": "b"}).deleted_count == 1
    assert store.delete_many({}).deleted_count == 2
    counters = MongoCountersStore("mongodb://fake", "test")
    assert counters.get_next_sequence("poster") == "1"
    assert counters.get_next_sequence("poster") == "2"
