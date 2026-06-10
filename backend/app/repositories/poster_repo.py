from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.poster import Poster, PosterMedia, Section


class PosterRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, poster: Poster) -> Poster:
        self.session.add(poster)
        await self.session.flush()
        return poster

    async def get_all_public(self) -> List[dict]:
        stmt = select(Poster).where(Poster.status == 'ACTIVE')
        result = await self.session.execute(stmt)
        posters = result.scalars().all()
        out = []
        for p in posters:
            thumbnail = None
            for m in p.media:
                if m.media_type.name == 'THUMBNAIL':
                    thumbnail = m.file_path
                    break
            out.append({
                "id": str(p.id),
                "slug": p.slug,
                "title": p.title,
                "description": p.description,
                "thumbnail_url": thumbnail,
                "section_count": len(p.sections),
            })
        return out

    async def get_by_id(self, poster_id):
        return await self.session.get(Poster, poster_id)

    async def delete(self, poster: Poster):
        await self.session.delete(poster)
        await self.session.flush()
