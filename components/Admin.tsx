import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { newsService } from '../services/newsService';
import { User, NewsArticle, Role } from '../types';
import { ADMIN_USERNAME } from '../constants';
import GlassCard from './common/GlassCard';

const Admin: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const [users, setUsers] = useState<Omit<User, 'password'>[]>([]);
    const [news, setNews] = useState<NewsArticle[]>([]);
    
    // User management state
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [userError, setUserError] = useState('');
    const [userSuccess, setUserSuccess] = useState('');

    // News management state
    const [newsTitle, setNewsTitle] = useState('');
    const [newsContent, setNewsContent] = useState('');
    const [newsError, setNewsError] = useState('');

    const fetchData = useCallback(() => {
        setUsers(authService.getAllUsers());
        setNews(newsService.getLatestNews(100)); // get more for admin view
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        setUserSuccess('');
        if (!newUsername || !newPassword) {
            setUserError('نام کاربری و رمز عبور الزامی است.');
            return;
        }
        const result = authService.createUser(newUsername, newPassword, Role.USER);
        if (result === 'exists') {
            setUserError('این نام کاربری قبلا ثبت شده است.');
        } else {
            setUserError('');
            setUserSuccess(`کاربر «${newUsername}» با موفقیت ایجاد شد.`);
            setTimeout(() => setUserSuccess(''), 4000);
            setNewUsername('');
            setNewPassword('');
            fetchData();
        }
    };
    
    const handleDeleteUser = (userId: string) => {
        if (window.confirm('آیا از حذف این کاربر مطمئن هستید؟')) {
            authService.deleteUser(userId);
            fetchData();
        }
    };

    const handleToggleUserRole = (userId: string, currentRole: Role) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;

        const newRole = currentRole === Role.ADMIN ? Role.USER : Role.ADMIN;
        const newRoleName = newRole === Role.ADMIN ? 'ادمین' : 'کاربر';
        if (window.confirm(`آیا از تغییر نقش کاربر «${user.username}» به «${newRoleName}» مطمئن هستید؟`)) {
            if(authService.updateUserRole(userId, newRole)) {
                setUserError('');
                setUserSuccess(`نقش کاربر «${user.username}» با موفقیت به «${newRoleName}» تغییر کرد.`);
                setTimeout(() => setUserSuccess(''), 4000);
                fetchData();
            }
        }
    };
    
    const handleAddNews = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsTitle || !newsContent) {
            setNewsError('عنوان و محتوا الزامی است.');
            return;
        }
        newsService.addNews(newsTitle, newsContent);
        setNewsError('');
        setNewsTitle('');
        setNewsContent('');
        fetchData();
    };

    const handleDeleteNews = (articleId: string) => {
        if (window.confirm('آیا از حذف این خبر مطمئن هستید؟')) {
            newsService.deleteNews(articleId);
            fetchData();
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6 px-4">
                <h1 className="text-3xl font-bold text-sky-800">داشبورد ادمین</h1>
                <p className="text-sky-700">خوش آمدید، {currentUser?.username}!</p>
                <button onClick={logout} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition">خروج</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <GlassCard>
                    <h2 className="text-2xl font-bold text-sky-800 mb-4">مدیریت کاربران</h2>
                    {userSuccess && (
                        <div className="bg-green-100 border-r-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                            <p>{userSuccess}</p>
                        </div>
                    )}
                    {userError && <p className="text-red-500 text-sm mb-4 text-center">{userError}</p>}
                    <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 items-center">
                        <input type="text" placeholder="نام کاربری" value={newUsername} onChange={e => setNewUsername(e.target.value)} className="px-3 py-2 bg-white/50 rounded-md focus:ring-sky-500 focus:outline-none"/>
                        <input type="password" placeholder="رمز عبور" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="px-3 py-2 bg-white/50 rounded-md focus:ring-sky-500 focus:outline-none"/>
                        <button type="submit" className="bg-sky-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-600 transition">افزودن کاربر</button>
                    </form>
                    <div className="max-h-80 overflow-y-auto pr-2 space-y-2">
                        {users.map(user => (
                            <div key={user.id} className="flex justify-between items-center p-3 bg-white/30 rounded-lg transition-all hover:bg-white/40 hover:shadow-md">
                                <div>
                                    <span className="font-semibold text-sky-900">{user.username}</span>
                                    <span className={`mr-2 text-xs font-bold px-2 py-1 rounded-full ${user.role === Role.ADMIN ? 'bg-sky-500 text-white' : 'bg-slate-300 text-slate-700'}`}>
                                        {user.role}
                                    </span>
                                </div>
                                {user.username !== ADMIN_USERNAME && (
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleToggleUserRole(user.id, user.role)} 
                                            className="text-xs font-semibold py-1 px-3 rounded-md transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200"
                                            title={user.role === Role.USER ? 'ارتقا به ادمین' : 'تنزل به کاربر'}
                                        >
                                           {user.role === Role.USER ? 'ارتقا' : 'تنزل'}
                                        </button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="text-xs font-semibold py-1 px-3 rounded-md transition-colors bg-red-100 text-red-700 hover:bg-red-200">حذف</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </GlassCard>
                <GlassCard>
                    <h2 className="text-2xl font-bold text-sky-800 mb-4">مدیریت اخبار</h2>
                    <form onSubmit={handleAddNews} className="flex flex-col gap-3 mb-6">
                        <input type="text" placeholder="عنوان خبر" value={newsTitle} onChange={e => setNewsTitle(e.target.value)} className="px-3 py-2 bg-white/50 rounded-md focus:ring-sky-500 focus:outline-none"/>
                        <textarea placeholder="محتوای خبر" value={newsContent} onChange={e => setNewsContent(e.target.value)} className="px-3 py-2 bg-white/50 rounded-md h-24 resize-none focus:ring-sky-500 focus:outline-none"/>
                        <button type="submit" className="bg-sky-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-600 transition">افزودن خبر</button>
                    </form>
                     {newsError && <p className="text-red-500 text-sm mb-4">{newsError}</p>}
                     <div className="max-h-80 overflow-y-auto pl-2 space-y-2">
                        {news.map(article => (
                            <div key={article.id} className="flex justify-between items-center p-3 bg-white/30 rounded-lg">
                                <span className="truncate pr-4">{article.title}</span>
                                <button onClick={() => handleDeleteNews(article.id)} className="text-red-500 hover:text-red-700 font-semibold flex-shrink-0">حذف</button>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Admin;
