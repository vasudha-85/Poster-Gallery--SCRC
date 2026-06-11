from db import posters_collection

posters_collection.insert_one({
    "title": "Test Poster"
})

print("Inserted")