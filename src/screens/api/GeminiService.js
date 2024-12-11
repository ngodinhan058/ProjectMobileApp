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

export const generateContent = async (prompt, productId1, productId2) => {
  console.log(prompt, productId1, productId2);
  
  try {
    const response = await axios.post(`${API_BASE_URL}/chat/compare`, null, {
      params: { 
        productIds: productId1,
        productIds: productId2 },
    });
    return response.data;
  } catch (error) {
    console.error('Error during content generation:', error);
    throw error;
  }
};
