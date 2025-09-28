
import { NewsArticle } from '../types';
import { LOCAL_STORAGE_KEYS } from '../constants';

class NewsService {
    private getNews(): NewsArticle[] {
        const news = localStorage.getItem(LOCAL_STORAGE_KEYS.NEWS);
        return news ? JSON.parse(news) : [];
    }

    private saveNews(news: NewsArticle[]): void {
        localStorage.setItem(LOCAL_STORAGE_KEYS.NEWS, JSON.stringify(news));
    }

    getLatestNews(limit: number = 5): NewsArticle[] {
        return this.getNews().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit);
    }

    addNews(title: string, content: string): NewsArticle {
        const news = this.getNews();
        const newArticle: NewsArticle = {
            id: crypto.randomUUID(),
            title,
            content,
            date: new Date().toISOString(),
        };
        news.push(newArticle);
        this.saveNews(news);
        return newArticle;
    }

    deleteNews(articleId: string): boolean {
        let news = this.getNews();
        const initialLength = news.length;
        news = news.filter(article => article.id !== articleId);
        if (news.length < initialLength) {
            this.saveNews(news);
            return true;
        }
        return false;
    }
}

export const newsService = new NewsService();
