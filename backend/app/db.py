from pymongo import MongoClient, ReturnDocument
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(
    os.getenv("MONGO_URI")
)

db = client[
    os.getenv("DB_NAME")
]

posters_collection = db["posters"]

sections_collection = db["sections"]

counters_collection = db["counters"]


def get_next_sequence(name: str):

    counter = counters_collection.find_one_and_update(
        {"_id": name},
        {"$inc": {"sequence_value": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )

    return counter["sequence_value"]