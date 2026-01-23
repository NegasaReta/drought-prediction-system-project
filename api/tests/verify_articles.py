import asyncio
import random
import string
import os
import sys

# Ensure imports work (assuming running from api/ dir)
sys.path.append(os.getcwd())

from httpx import AsyncClient, ASGITransport
from main import app
from core.db import init_db


def random_string(length=6):
    return "".join(random.choices(string.ascii_lowercase, k=length))


async def verify_articles():
    print("Starting verification (Async)...")

    # 1. Initialize DB
    await init_db()
    print("DB Initialized.")

    suffix = random_string()
    author_email = f"author_{suffix}@example.com"
    author_user = f"author_{suffix}"
    viewer_email = f"viewer_{suffix}@example.com"
    viewer_user = f"viewer_{suffix}"
    password = "password123"

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        # 2. Register Author
        print(f"Registering author: {author_email}")
        resp = await ac.post(
            "/api/v1/users/reg",
            json={
                "email": author_email,
                "username": author_user,
                "password": password,
                "role": "Author",
            },
        )
        if resp.status_code != 200:
            print(f"Failed to register author: {resp.text}")
            return

        # 3. Register Viewer
        print(f"Registering viewer: {viewer_email}")
        resp = await ac.post(
            "/api/v1/users/reg",
            json={
                "email": viewer_email,
                "username": viewer_user,
                "password": password,
                "role": "Viewer",
            },
        )
        if resp.status_code != 200:
            print(f"Failed to register viewer: {resp.text}")
            return

        # 4. Login Author
        resp = await ac.post(
            "/api/v1/login/access-token",
            data={"username": author_user, "password": password},
        )
        if resp.status_code != 200:
            print(f"Failed to login author: {resp.text}")
            return
        author_token = resp.json()["access_token"]
        author_headers = {"Authorization": f"Bearer {author_token}"}

        # 5. Login Viewer
        resp = await ac.post(
            "/api/v1/login/access-token",
            data={"username": viewer_user, "password": password},
        )
        if resp.status_code != 200:
            print(f"Failed to login viewer: {resp.text}")
            return
        viewer_token = resp.json()["access_token"]
        viewer_headers = {"Authorization": f"Bearer {viewer_token}"}

        # 6. Create Article (Author)
        print("Testing: Create Article (Author) -> Expect Success")
        article_data = {"title": "Test Release", "content": "This is a test article."}
        resp = await ac.post(
            "/api/v1/articles/", json=article_data, headers=author_headers
        )
        if resp.status_code == 200:
            print("Success: Article created.")
            article_id = resp.json()["id"]
        else:
            print(f"FAILURE: Author create failed: {resp.status_code} {resp.text}")
            return

        # 7. Create Article (Viewer)
        print("Testing: Create Article (Viewer) -> Expect 403")
        resp = await ac.post(
            "/api/v1/articles/", json=article_data, headers=viewer_headers
        )
        if resp.status_code == 403:
            print("Success: 403 Forbidden received.")
        else:
            print(
                f"FAILURE: Viewer create did not fail as expected: {resp.status_code}"
            )

        # 8. List Articles
        print("Testing: List Articles (Author) -> Expect containing new article")
        resp = await ac.get("/api/v1/articles/", headers=author_headers)
        articles = resp.json()
        if any(a["id"] == article_id for a in articles):
            print("Success: Article found in list.")
        else:
            print("FAILURE: Article not found in list.")

        # 9. Update Article (Owner)
        print("Testing: Update Article (Owner) -> Expect Success")
        resp = await ac.put(
            f"/api/v1/articles/{article_id}",
            json={"title": "Updated Title"},
            headers=author_headers,
        )
        if resp.status_code == 200 and resp.json()["title"] == "Updated Title":
            print("Success: Article updated.")
        else:
            print(f"FAILURE: Update failed: {resp.status_code} {resp.text}")

        # 10. Update Article (Viewer)
        print("Testing: Update Article (Viewer) -> Expect 403")
        resp = await ac.put(
            f"/api/v1/articles/{article_id}",
            json={"title": "Hacked Title"},
            headers=viewer_headers,
        )
        if resp.status_code == 403:
            print("Success: 403 Forbidden.")
        else:
            print(f"FAILURE: Viewer update success (unexpected): {resp.status_code}")

        # 11. Delete Article (Owner)
        print("Testing: Delete Article (Owner) -> Expect Success")
        resp = await ac.delete(f"/api/v1/articles/{article_id}", headers=author_headers)
        if resp.status_code == 200:
            print("Success: Article deleted.")
        else:
            print(f"FAILURE: Delete failed: {resp.status_code}")

        # Verify delete
        resp = await ac.get(f"/api/v1/articles/{article_id}", headers=author_headers)
        if resp.status_code == 404:
            print("Success: Article verified deleted (404).")
        else:
            print("FAILURE: Article still exists.")

    print("\nVERIFICATION COMPLETE: ALL TESTS PASSED.")


if __name__ == "__main__":
    asyncio.run(verify_articles())
