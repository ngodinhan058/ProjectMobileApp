import axios from 'axios';
import { SOCKET_URL } from './config_onlyURL';

// Đặt URL cơ bản cho API (đổi thành URL server của bạn)
const API_BASE_URL = `${SOCKET_URL}/api/gemini`;

export const chatDiscussion = async (question) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat`, null, {
      params: { question },
    });
    return response.data;
  } catch (error) {
    console.error('Error during chat discussion:', error);
    throw error;
  }
};

export const generateContent = async (prompt, productId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate`, null, {
      params: { prompt, productId },
    });
    return response.data;
  } catch (error) {
    console.error('Error during content generation:', error);
    throw error;
  }
};
