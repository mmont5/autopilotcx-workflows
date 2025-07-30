import asyncio
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

async def test_llm_service():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "http://localhost:8200/v1/completions",
                json={
                    "prompt": "Write a short story about a magical forest",
                    "max_tokens": 100
                }
            )
            print("LLM Service Test:")
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
        except Exception as e:
            print(f"Error testing LLM service: {e}")

async def test_image_gen_service():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "http://localhost:8300/v1/generate",
                json={
                    "prompt": "A beautiful sunset over mountains",
                    "width": 512,
                    "height": 512
                }
            )
            print("\nImage Generation Service Test:")
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
        except Exception as e:
            print(f"Error testing image generation service: {e}")

async def test_video_gen_service():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "http://localhost:8400/v1/generate",
                json={
                    "prompt": "A time-lapse of clouds moving across the sky",
                    "duration": 5,
                    "fps": 24
                }
            )
            print("\nVideo Generation Service Test:")
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
        except Exception as e:
            print(f"Error testing video generation service: {e}")

async def test_moderation_service():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "http://localhost:8600/v1/moderate",
                json={
                    "text": "This is a test message for content moderation",
                    "content_type": "text"
                }
            )
            print("\nModeration Service Test:")
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
        except Exception as e:
            print(f"Error testing moderation service: {e}")

async def main():
    print("Testing AI Services...")
    await test_llm_service()
    await test_image_gen_service()
    await test_video_gen_service()
    await test_moderation_service()

if __name__ == "__main__":
    asyncio.run(main()) 