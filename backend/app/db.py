import os
from typing import List, Dict, Any, Optional

from pymongo import MongoClient, ReturnDocument
from pymongo.errors import PyMongoError


class MongoStore:

    def __init__(
        self,
        mongo_uri: str,
        database_name: str,
        collection_name: str
    ):
        self.client = MongoClient(
            mongo_uri,
            serverSelectionTimeoutMS=5000
        )

        self.db = self.client[database_name]
        self.collection = self.db[collection_name]


    def find(
        self,
        query: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:

        return list(
            self.collection.find(query or {})
        )

    def count_documents(
        self,
        query: Optional[Dict[str, Any]] = None
    ):
        return self.collection.count_documents(query or {})

    def find_one(
        self,
        query: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:

        return self.collection.find_one(query)


    def insert_one(
        self,
        document: Dict[str, Any]
    ):

        return self.collection.insert_one(document)


    def insert_many(
        self,
        documents: List[Dict[str, Any]]
    ):

        return self.collection.insert_many(documents)


    def update_one(
        self,
        query: Dict[str, Any],
        update: Dict[str, Any]
    ):

        if "$set" not in update:
            update = {
                "$set": update
            }

        return self.collection.update_one(
            query,
            update,
            upsert=True
        )


    def save(
        self,
        document: Dict[str, Any]
    ):

        if "_id" in document:
            query = {
                "_id": document["_id"]
            }

        elif "id" in document:
            query = {
                "id": document["id"]
            }

        else:
            raise ValueError(
                "Document requires _id or id"
            )

        return self.update_one(
            query,
            {
                "$set": document
            }
        )


    def delete_one(
        self,
        query: Dict[str, Any]
    ):

        return self.collection.delete_one(query)


    def delete_many(
        self,
        query: Dict[str, Any]
    ):

        return self.collection.delete_many(query)



class MongoCountersStore:

    def __init__(
        self,
        mongo_uri: str,
        database_name: str,
        collection_name="counters"
    ):

        self.client = MongoClient(
            mongo_uri,
            serverSelectionTimeoutMS=5000
        )

        self.db = self.client[database_name]

        self.collection = self.db[collection_name]


    def get_next_sequence(
        self,
        name: str
    ):

        doc = self.collection.find_one_and_update(
            {
                "_id": name
            },
            {
                "$inc": {
                    "value": 1
                }
            },
            upsert=True,
            return_document=ReturnDocument.AFTER
        )

        return str(doc["value"])



# ==========================
# MongoDB Initialization
# ==========================


mongo_uri = os.getenv("MONGO_URI")

if not mongo_uri:
    raise RuntimeError(
        "MONGO_URI is missing"
    )


mongo_db_name = os.getenv(
    "MONGO_DB_NAME",
    "poster_gallery"
)


try:

    client = MongoClient(
        mongo_uri,
        serverSelectionTimeoutMS=5000
    )

    client.admin.command("ping")


    posters_collection = MongoStore(
        mongo_uri,
        mongo_db_name,
        os.getenv(
            "MONGO_POSTERS_COLLECTION",
            "posters"
        )
    )


    sections_collection = MongoStore(
        mongo_uri,
        mongo_db_name,
        os.getenv(
            "MONGO_SECTIONS_COLLECTION",
            "sections"
        )
    )


    counters_store = MongoCountersStore(
        mongo_uri,
        mongo_db_name,
        os.getenv(
            "MONGO_COUNTERS_COLLECTION",
            "counters"
        )
    )


    print("✅ Connected to MongoDB")


except PyMongoError as e:

    raise RuntimeError(
        f"❌ MongoDB connection failed: {e}"
    )



def get_next_sequence(name: str):

    return counters_store.get_next_sequence(name)