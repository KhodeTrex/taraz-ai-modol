import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { newsService } from '../services/newsService';
import { NewsArticle } from '../types';
import GlassCard from './common/GlassCard';
import Spinner from './common/Spinner';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const { login } = useAuth();

  useEffect(() => {
    setNews(newsService.getLatestNews());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const user = authService.login(username, password);
      if (user) {
        login(user);
      } else {
        setError('نام کاربری یا رمز عبور نامعتبر است.');
      }
      setIsLoading(false);
    }, 500); // Simulate network delay
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
      <div className="w-full lg:w-1/2">
        <GlassCard className="transition-all duration-300 hover:shadow-xl">
          <h1 className="text-4xl font-bold text-center text-sky-800 mb-2">خوش آمدید</h1>
          <p className="text-center text-sky-700 mb-8">برای ادامه به چت با هوش مصنوعی وارد شوید</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="نام کاربری"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
            <input
              type="password"
              placeholder="رمز عبور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sky-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition disabled:bg-sky-300 flex items-center justify-center"
            >
              {isLoading ? <Spinner /> : 'ورود'}
            </button>
          </form>
        </GlassCard>
      </div>
      <div className="w-full lg:w-1/2">
        <GlassCard className="h-full">
          <h2 className="text-2xl font-bold text-sky-800 mb-4 border-b-2 border-sky-300 pb-2">آخرین اخبار</h2>
          <div className="space-y-4 max-h-[25rem] overflow-y-auto pl-2">
            {news.length > 0 ? (
              news.map((article) => (
                <div key={article.id} className="p-3 bg-white/30 rounded-lg transition-all duration-200 hover:bg-white/50">
                  <h3 className="font-semibold text-sky-900">{article.title}</h3>
                  <p className="text-sm text-slate-700">{article.content}</p>
                  <p className="text-xs text-slate-500 mt-1">{new Date(article.date).toLocaleDateString('fa-IR')}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-600">در حال حاضر خبری موجود نیست.</p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Login;