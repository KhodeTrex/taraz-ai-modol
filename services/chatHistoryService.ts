
import { Message } from '../types';
import { LOCAL_STORAGE_KEYS } from '../constants';

class ChatHistoryService {
    private getKey(username: string): string {
        return `${LOCAL_STORAGE_KEYS.CHAT_HISTORY_PREFIX}${username}`;
    }

    getHistory(username: string): Message[] {
        const history = localStorage.getItem(this.getKey(username));
        return history ? JSON.parse(history) : [];
    }

    saveHistory(username: string, history: Message[]): void {
        localStorage.setItem(this.getKey(username), JSON.stringify(history));
    }
    
    clearHistory(username: string): void {
        localStorage.removeItem(this.getKey(username));
    }
}

export const chatHistoryService = new ChatHistoryService();
