import { useEffect, useState } from "react";
import { APP_CONSTANT } from "../util/constant";
import StartInterview from "../components/StartInterview";
import { startInterviewAPI } from "../services/interview";
import { playAudio } from "../util/audio";


const InterviewPage = () => {
    const [sessionId, setSessionId]=useState(null);
    const [status, setStatus]=useState(APP_CONSTANT.IDLE);
    const [question,setQuestion]= useState("");
    const [report,setReport] = useState(null);
    const endInterview=()=>{

    }
    const skipQuestion=()=>{
        
    }

     useEffect(() => {
        if(status === APP_CONSTANT.ASKING) {
            playAudio(question, () => {
                setStatus(APP_CONSTANT.LISTENING);

                
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
    </>
}

export default InterviewPage;