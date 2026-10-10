from fastapi import APIRouter, HTTPException, status

from models.interview import InterviewStatusEnum
from request_model import AnswerRequest
from services.interview_service import create_session, get_session, save_answer

router = APIRouter(
    prefix="/interview",
    tags=["Interview"]
)

@router.get("/start")
async def start_interview():
    questions=[
        "add 1 and 2 and what is the value?",
        "what is javascript",
        "what is inheritance?"
    ]
    session=create_session()
    session.questions=questions
    return {
        "introText":"Hey Piyush welcome to ai interview platform",
        "session_id":session.session_id,
        "firstQuestion": session.questions[0]
    }

@router.post("/submit")
async def submit_answer(answerReq: AnswerRequest):
    session= get_session(answerReq.session_id)
    if not session or session.status== InterviewStatusEnum.COMPLETED:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview session not found")
    save_answer(answerReq.answer,answerReq.skip,session)
