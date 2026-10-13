from fastapi import FastAPI
from routers.interview import router as interview_router
app = FastAPI(
    version="0.0.1",
    title="AI interview platform",
    description="AI interview platform using fastAPI"
)
app.include_router(interview_router)