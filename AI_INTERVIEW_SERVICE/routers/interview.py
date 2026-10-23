from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from AI_INTERVIEW_SERVICE.services.ai_service import generate_questions_intro
from AI_INTERVIEW_SERVICE.util.file_util import validate_file, extract_text
from models.interview import InterviewStatusEnum
from request_model.AnswerRequest import AnswerRequest
from response_model.AnswerResponse import AnswerResponse
from services.interview_service import create_session, get_session, save_answer

router = APIRouter(
    prefix="/interview",
    tags=["Interview"]
)
@router.post("/generate-question")
async def generate_questions(
    job_title: str = Form(...),
    job_description: str = Form(...),
    resume: UploadFile = File(...)
):
      await validate_file(resume)
      resume_text=await extract_text(resume)

      resp = await generate_questions_intro(job_title=job_title, job_description=job_description, resume_text=resume_text)

      session = create_session()
      session.questions = resp.get("questions")
      session.introText = resp.get("introText")
      
@router.get("/start")
async def start_interview():
    questions=[
        "add 1 and 2 and what is the value?",
        "what is javascript",
        "what is inheritance?"
    ]
    
    return {
        "introText":"Hey Piyush welcome to ai interview platform",
        "session_id":session.session_id,
        "firstQuestion": session.questions[0]
    }

@router.post("/submit", response_model=AnswerResponse)
async def submit_answer(answerReq: AnswerRequest):
    session= get_session(answerReq.session_id)
    if not session or session.status== InterviewStatusEnum.COMPLETED:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview session not found")
    save_answer(answerReq.answer,answerReq.skip,session)

    if session.status==InterviewStatusEnum.COMPLETED:
        return {
            "interviewEnded": True
        }

    return{
        "interviewEnded":False,
        "nextQuestion": session.questions[session.current_index]
    }

@router.put("/end/{session_id}")
async def end_interview(session_id: str):
    session= get_session(session_id)
    if not session or session.status== InterviewStatusEnum.COMPLETED:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview session not found")

    session.status=InterviewStatusEnum.COMPLETED
    return {
                "interviewEnded": True
            }

@router.get("/report/{session_id}")
async def report(session_id:str):
      session= get_session(session_id)
      if not session or session.status== InterviewStatusEnum.COMPLETED:
                 raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview session not found")

      return{
            "result": "Your interview report"
      }