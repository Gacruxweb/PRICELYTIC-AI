import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const geminiModel = "gemini-3-flash-preview";

export async function searchProducts(query: string) {
  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: `You are a professional shopping assistant and market analyst. 
    Find exactly 20 products that most closely match this query: "${query}".
    
    CRITICAL INSTRUCTIONS:
    1. If the query specifies a BRAND and MODEL (e.g., "S26 Ultra"), ONLY return that specific model or its direct variations. Do not return older models unless specifically asked.
    2. If a REGION is specified (e.g., "Bangladesh"), prioritize local stores from that region (e.g., Star Tech, Ryans, Daraz, Pickaboo for Bangladesh). IMPORTANT: If you do not have the exact deep link for a product, generate a working SEARCH URL for that store instead (e.g., 'https://www.daraz.com.bd/catalog/?q=...' or 'https://www.startech.com.bd/product/search&search=...').
    3. For images, attempt to find a descriptive placeholder from Unsplash that matches the product category (e.g., 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800' for a Samsung phone).
    
    Return a JSON array of objects following this TypeScript interface. IMPORTANT: Ensure the JSON string is valid and does NOT contain any unescaped control characters. All links MUST be valid URLs.
    
    interface Product {
      id: string;
      name: string;
      description: string;
      imageUrl: string;
      category: string;
      rating: number;
      reviewCount: number;
      offers: {
        id: string;
        storeName: string;
        price: number;
        currency: string;
        link: string;
        isLocal: boolean;
        isInternational: boolean;
        updatedAt: string;
      }[];
      history: { date: string; price: number; }[];
    }
    
    Ensure results are highly relevant to: "${query}".`,
    config: {
      responseMimeType: "application/json",
    }
  });
  
  try {
    const text = response.text;
    return JSON.parse(text || "[]");
  } catch (e) {
    console.error("Failed to parse Gemini response:", e);
    return [];
  }
}

export async function analyzeProductImage(base64Image: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { mimeType: "image/jpeg", data: base64Image } },
        { text: "What is this product? Identify the exact model and key features for price comparison." }
      ]
    }
  });
  
  return response.text;
}
