
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  username: string;
  password?: string; // Optional because we don't want to pass it around everywhere
  role: Role;
}

export enum MessageSender {
    USER = 'USER',
    AI = 'AI',
}

export interface Message {
    id: string;
    text: string;
    sender: MessageSender;
}

export interface NewsArticle {
    id: string;
    title: string;
    content: string;
    date: string;
}
