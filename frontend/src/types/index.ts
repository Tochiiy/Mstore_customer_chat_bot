
export interface Product {
  id: number;        
  name: string;        
  brand: string;      
  gender: string;      
  price: number;      
  description: string; 
  color: string;       
  image_url?: string;  
}
export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface ChatResponse {
  response: string; 
}