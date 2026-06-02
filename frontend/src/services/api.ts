import type { Product, ChatMessage, ChatResponse } from '../types';

// Use environment variable if it exists, otherwise default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const shopApi = {

  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Map PascalCase backend fields to camelCase frontend types
      return data.map((p: any) => ({
        id: p.ProductID,
        name: p.ProductName,
        brand: p.ProductBrand,
        gender: p.Gender,
        price: p.Price,
        description: p.Description,
        color: p.PrimaryColor
      }));
      
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  sendChatMessage: async (message: string, history: ChatMessage[]): Promise<ChatResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: message,
          history: history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }))
        })
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error sending chat message:", error);
      throw error;
    }
  }
};