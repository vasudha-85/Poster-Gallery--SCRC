from sqlalchemy.ext.asyncio import AsyncSession
from app.models.poster import Section


class SectionRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_bulk(self, poster_id, sections: list[dict]):
        objs = []
        for s in sections:
            obj = Section(poster_id=poster_id, **s)
            self.session.add(obj)
            objs.append(obj)
        await self.session.flush()
        return objs

    async def list_by_poster(self, poster_id):
        stmt = select(Section).where(Section.poster_id == poster_id).order_by(Section.start_time)
        result = await self.session.execute(stmt)
        return result.scalars().all()
