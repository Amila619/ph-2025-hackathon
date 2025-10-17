import { AxiosInstance } from "./Axios.service";

export const getLoginStatus = async () => {
  try {
    const res = await AxiosInstance.get(`/api/status`);
    return res.data;
  } catch (err) {
    console.error("Error Logging", err.message);
    throw err;
  }
};

