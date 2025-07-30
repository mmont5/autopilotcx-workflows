import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import uuid
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("POSTGRES_URL", "postgresql://megarray:megarray@localhost:5432/megarray")
engine = create_async_engine(DATABASE_URL)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def seed_users(session):
    users = [
        {
            "id": str(uuid.uuid4()),
            "email": "creator@example.com",
            "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # password: password123
            "full_name": "NFT Creator",
            "tier": "creator",
            "ai_posts_count": 0
        },
        {
            "id": str(uuid.uuid4()),
            "email": "collector@example.com",
            "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
            "full_name": "NFT Collector",
            "tier": "collector",
            "ai_posts_count": 0
        }
    ]
    for user in users:
        await session.execute(
            "INSERT INTO users (id, email, hashed_password, full_name, tier, ai_posts_count) "
            "VALUES (:id, :email, :hashed_password, :full_name, :tier, :ai_posts_count)",
            user
        )

async def seed_nfts(session):
    nfts = [
        {
            "id": str(uuid.uuid4()),
            "name": "Digital Art #1",
            "description": "A beautiful digital artwork",
            "image_url": "https://example.com/image1.jpg",
            "price": 1.0,
            "creator_id": "creator@example.com",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Digital Art #2",
            "description": "Another amazing digital artwork",
            "image_url": "https://example.com/image2.jpg",
            "price": 2.0,
            "creator_id": "creator@example.com",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
    ]
    for nft in nfts:
        await session.execute(
            "INSERT INTO nfts (id, name, description, image_url, price, creator_id, created_at, updated_at) "
            "VALUES (:id, :name, :description, :image_url, :price, :creator_id, :created_at, :updated_at)",
            nft
        )

async def seed_collections(session):
    collections = [
        {
            "id": str(uuid.uuid4()),
            "name": "Digital Art Collection",
            "description": "A collection of digital artworks",
            "creator_id": "creator@example.com",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
    ]
    for collection in collections:
        await session.execute(
            "INSERT INTO collections (id, name, description, creator_id, created_at, updated_at) "
            "VALUES (:id, :name, :description, :creator_id, :created_at, :updated_at)",
            collection
        )

async def main():
    async with async_session() as session:
        try:
            # Seed users
            await seed_users(session)
            
            # Seed NFTs
            await seed_nfts(session)
            
            # Seed collections
            await seed_collections(session)
            
            await session.commit()
            print("Database seeded successfully!")
        except Exception as e:
            await session.rollback()
            print(f"Error seeding database: {e}")

if __name__ == "__main__":
    asyncio.run(main()) 