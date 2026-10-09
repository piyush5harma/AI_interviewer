from fastapi import APIRouter

router = APIRouter(
    prefix="/interview",
    tags=["Interview"]
)

@router.get("/")
async def hello():
    return "AI interview platform"