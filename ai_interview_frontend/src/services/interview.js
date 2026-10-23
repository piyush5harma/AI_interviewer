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

export const submitAPI = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/submit`, payload);
    return response.data;
  } catch (error) {
    console.error("Error: ", error);
  }
  return null;
};

export const reportAPI = async (sessionId) => {
  try {
    const response = await axios.get(`${BASE_URL}/report/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Error: ", error);
  }

  return null;
};

export const endInterviewAPI = async (sessionId) => {
  try {
    const response = await axios.put(`${BASE_URL}/end/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Error: ", error);
  }

  return null;
};
