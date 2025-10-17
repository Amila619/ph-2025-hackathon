import { AxiosInstance } from "./Axios.service";

export const chatBotResponse = async (msg) => {
  try {
    const res = await AxiosInstance.post("/chat", { message: msg });
    return res.data;
  } catch (err) {
    console.error("Error Response", err.message);
    throw err;
  }
}