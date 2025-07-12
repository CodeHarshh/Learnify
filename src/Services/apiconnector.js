import axios from "axios";

export const apiConnector = async (method, url, data = null, headers = {}, params = null) => {
  try {
    const response = await axios({
      method,
      url,
      data,
      headers,
      params,
    });
    // console.log(`API call to ${url} successful:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error in API call to ${url}:`, error);
    throw error.response?.data || error.message || "Unknown error occurred!";
  }
};
