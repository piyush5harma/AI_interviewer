import { useEffect, useState } from "react";
import { APP_CONSTANT } from "../util/constant";
import StartInterview from "../components/StartInterview";
import { startInterviewAPI,submitAPI, reportAPI, endInterviewAPI } from "../services/interview";
import { playAudio } from "../util/audio";
import Interview from "../components/Interview"
import { useSpeechToText } from "../hooks/useSpeechToText"
import Report from "../components/Report";

const InterviewPage = () => {
    const [sessionId, setSessionId]=useState(null);
    const [status, setStatus]=useState(APP_CONSTANT.IDLE);
    const [question,setQuestion]= useState("");
    const [report,setReport] = useState(null);

    const onAutoSubmit = async (finalText) => {
        stopListening();

        if(!finalText.trim()) {
            return;
        }
        const payload = {
            "session_id": sessionId,
            "answer": finalText,
            "skip": false
        }

        const data = await submitAPI(payload);

        if(data.interviewEnded) {
            finshInterview();
        } else {
            setQuestion(data.nextQuestion);
            setStatus(APP_CONSTANT.ASKING);
        }

    }
    const { startListening, stopListening } = useSpeechToText(onAutoSubmit);

    const finshInterview = async () => {
        setStatus(APP_CONSTANT.COMPLETED);
        const data = await reportAPI(sessionId);

        if(!data) {
            return;
        }

        setReport(data.result);

    }

    const endInterview=async()=>{
          stopListening();

        await endInterviewAPI(sessionId);
        await finshInterview();
    }
    const skipQuestion=async()=>{
         stopListening();
        const payload = {
            "session_id": sessionId,
            "answer": "",
            "skip": true
        }
        const data = await submitAPI(payload);

        if(data.interviewEnded) {
            finshInterview();
        } else {
            setQuestion(data.nextQuestion);
            setStatus(APP_CONSTANT.ASKING);
        }
    }

     useEffect(() => {
        if(status === APP_CONSTANT.ASKING) {
            playAudio(question, () => {
                setStatus(APP_CONSTANT.LISTENING);

                startListening();
            })
        }
    }, [status, question]);


    const startInterview= async()=>{
        const data = await startInterviewAPI();
        if(!data){
            console.error("Something went wrong");
            return;
        }
        setSessionId(data.session_id);
        setQuestion(data.firstQuestion);
        setStatus(APP_CONSTANT.INTRO);
        const introText=data.introText;
        playAudio(introText, ()=>{
            setStatus(APP_CONSTANT.ASKING);
        })
    }
    return <>
    { status === APP_CONSTANT.IDLE && <StartInterview onClick={startInterview}/> }
    { (status === APP_CONSTANT.ASKING || status === APP_CONSTANT.LISTENING) && <Interview skipQuestion={skipQuestion} endInterview={endInterview} state={status}/> } 
    { status === APP_CONSTANT.COMPLETED && <Report report={report}/> }

    </>
}

export default InterviewPage;