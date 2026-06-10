from sqlalchemy.ext.asyncio import AsyncSession
from app.models.poster import AuditLog, AuditActionEnum


class AuditRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, action: AuditActionEnum, description: str = None, poster_id=None):
        obj = AuditLog(action=action, description=description, poster_id=poster_id)
        self.session.add(obj)
        await self.session.flush()
        return obj
