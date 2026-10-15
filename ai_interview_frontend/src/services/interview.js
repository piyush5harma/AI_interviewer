import axios from "axios";
const BASE_URL="http://localhost:8000/interview";
export const startInterviewAPI = async()=>{
    try {
       const response = await axios.get(`${BASE_URL}/start`);
       return response.data;
    } catch (error) {
        console.error("Error: ", error);
    }
    return null;
}