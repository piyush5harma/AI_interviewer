import { useState } from "react";
import { APP_CONSTANT } from "../util/constant";
import StartInterview from "../components/StartInterview";
import { startInterviewAPI } from "../services/interview";


const InterviewPage = () => {
    const [sessionId, setSessionId]=useState(null);
    const [status, setStatus]=useState(APP_CONSTANT.IDLE);
    const [question,setQuestion]= useState("");
    const [report,setReport] = useState(null);
    const startInterview=()=>{
        const data = startInterviewAPI();
        if(!data){
            console.error("Something went wrong");
            return;
        }
    }
    return <>
    { status === APP_CONSTANT.IDLE && <StartInterview onClick={startInterview}/> }
    </>
}

export default InterviewPage;