import uuid

from models.interview import InterviewSession
from store.session_store import SESSION_STORE


def create_session()-> InterviewSession:
    session_id=str(uuid.uuid4())
    interview_session=InterviewSession(
        session_id=session_id
    )

    SESSION_STORE[session_id]=interview_session
    return interview_session

def get_session(session_id:str)->InterviewSession:
    session=SESSION_STORE[session_id]

    if not session:
        return None

    return session