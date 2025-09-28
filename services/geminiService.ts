import { GoogleGenAI, GenerateContentResponse }from "@google/genai";
import { Message, MessageSender } from '../types';

type GeminiContent = {
    role: 'user' | 'model';
    parts: { text: string }[];
};

class GeminiService {
    private ai: GoogleGenAI | null = null;

    constructor() {
        try {
            // The API key MUST be obtained exclusively from the environment variable `process.env.API_KEY`.
            if (process.env.API_KEY) {
                this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            } else {
                console.error("API_KEY environment variable not set.");
            }
        } catch(e) {
            console.error("Failed to initialize GoogleGenAI.", e);
        }
    }

    private convertHistoryToGeminiFormat(history: Message[]): GeminiContent[] {
        return history.map(msg => ({
            role: msg.sender === MessageSender.USER ? 'user' : 'model',
            parts: [{ text: msg.text }],
        }));
    }

    async getChatResponse(prompt: string, username: string, history: Message[]): Promise<string> {
        if (!this.ai) {
             return 'خطا: سرویس هوش مصنوعی به درستی مقداردهی اولیه نشده است. لطفاً کلید API را بررسی کنید.';
        }
        
        try {
            const model = 'gemini-2.5-flash';
            // The `history` array passed from Chat.tsx will contain the full conversation, including the latest user message.
            const contents = this.convertHistoryToGeminiFormat(history);

            const response: GenerateContentResponse = await this.ai.models.generateContent({
                model,
                contents,
                config: {
                    systemInstruction: 'شما یک مدل هوش مصنوعی هستید که به سوالات پاسخ می‌دهد. در معرفی خود، از اشاره به اینکه توسط گوگل ساخته شده‌اید خودداری کنید و فقط بگویید یک مدل هوش مصنوعی هستید.',
                }
            });
            
            return response.text;

        } catch (error) {
            console.error('Error getting response from Gemini:', error);
            return 'متاسفانه در حال حاضر قادر به پاسخگویی نیستم. لطفا دوباره تلاش کنید.';
        }
    }

    clearChatSession(username: string): void {
        // This is a no-op because the chat session is recreated on each call
        // based on the history provided from the client.
    }
}

export const geminiService = new GeminiService();