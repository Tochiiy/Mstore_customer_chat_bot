import type { Product, ChatMessage, ChatResponse } from '../types';


const API_BASE_URL = 'http://127.0.0.1:8000'; 

export const shopApi = {

  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Send a message to the AI agent
  sendChatMessage: async (message: string, history: ChatMessage[]): Promise<ChatResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          query: message, // <--- CHANGED TO "query" TO MATCH FASTAPI
          history: history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }))
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error sending chat message:", error);
      throw error;
    }
  }
};