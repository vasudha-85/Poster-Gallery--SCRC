import os
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
os.environ.setdefault("MONGO_URI", "mongodb://unit-test")
os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("ADMIN_USERNAME", "admin")
os.environ.setdefault("ADMIN_PASSWORD", "secret")


class InsertResult:
    def __init__(self, inserted_id):
        self.inserted_id = inserted_id


class DeleteResult:
    def __init__(self, deleted_count):
        self.deleted_count = deleted_count


class UpdateResult:
    def __init__(self, matched_count, modified_count):
        self.matched_count = matched_count
        self.modified_count = modified_count


class MemoryCollection:
    def __init__(self):
        self.docs = []

    @staticmethod
    def matches(document, query):
        for key, expected in (query or {}).items():
            actual = document.get(key)
            if isinstance(expected, dict) and "$nin" in expected:
                if actual in expected["$nin"]:
                    return False
            elif actual != expected:
                return False
        return True

    def find(self, query=None):
        return [doc.copy() for doc in self.docs if self.matches(doc, query)]

    def find_one(self, query):
        return next((doc.copy() for doc in self.docs if self.matches(doc, query)), None)

    def count_documents(self, query=None):
        return sum(self.matches(doc, query) for doc in self.docs)

    def insert_one(self, document):
        from bson import ObjectId
        item = document.copy()
        item.setdefault("_id", ObjectId())
        self.docs.append(item)
        return InsertResult(item["_id"])

    def insert_many(self, documents):
        return [self.insert_one(doc).inserted_id for doc in documents]

    def update_one(self, query, update, upsert=False):
        for doc in self.docs:
            if self.matches(doc, query):
                doc.update(update.get("$set", update))
                return UpdateResult(1, 1)
        if upsert:
            new_doc = dict(query)
            new_doc.update(update.get("$set", update))
            self.insert_one(new_doc)
            return UpdateResult(0, 0)
        return UpdateResult(0, 0)

    def delete_one(self, query):
        for i, doc in enumerate(self.docs):
            if self.matches(doc, query):
                del self.docs[i]
                return DeleteResult(1)
        return DeleteResult(0)

    def delete_many(self, query):
        old_count = len(self.docs)
        self.docs[:] = [doc for doc in self.docs if not self.matches(doc, query)]
        return DeleteResult(old_count - len(self.docs))

    def find_one_and_update(self, query, update, upsert=False, return_document=None):
        doc = next((d for d in self.docs if self.matches(d, query)), None)
        if doc is None and upsert:
            doc = dict(query)
            doc["value"] = 0
            self.docs.append(doc)
        doc["value"] += update.get("$inc", {}).get("value", 0)
        return doc.copy()


class MemoryDatabase:
    def __init__(self):
        self.collections = {}

    def __getitem__(self, name):
        return self.collections.setdefault(name, MemoryCollection())


class MemoryClient:
    def __init__(self, *args, **kwargs):
        self.databases = {}
        self.admin = self

    def __getitem__(self, name):
        return self.databases.setdefault(name, MemoryDatabase())

    def command(self, *_args, **_kwargs):
        return {"ok": 1}


import pymongo
pymongo.MongoClient = MemoryClient


@pytest.fixture(scope="session", autouse=True)
def use_memory_mongo():
    pymongo.MongoClient = MemoryClient


@pytest.fixture(autouse=True)
def clear_database(use_memory_mongo):
    from app.db import posters_collection, sections_collection
    posters_collection.collection.docs.clear()
    sections_collection.collection.docs.clear()
    yield


@pytest.fixture
def client():
    from fastapi.testclient import TestClient
    from app.main import app
    return TestClient(app)
