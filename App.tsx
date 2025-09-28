import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { User, Role } from './types';
import { authService } from './services/authService';
import Login from './components/Login';
import Chat from './components/Chat';
import Admin from './components/Admin';
import { AuthContext } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(authService.getCurrentUser());

  useEffect(() => {
    // Initialize default admin user if no users exist
    authService.initializeUsers();
  }, []);

  const login = useCallback((user: User) => {
    setCurrentUser(user);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setCurrentUser(null);
  }, []);

  const authContextValue = useMemo(() => ({
    currentUser,
    login,
    logout,
  }), [currentUser, login, logout]);

  const renderContent = () => {
    if (!currentUser) {
      return <Login />;
    }
    if (currentUser.role === Role.ADMIN) {
      return <Admin />;
    }
    return <Chat />;
  };

  return (
    <ThemeProvider>
      <AuthContext.Provider value={authContextValue}>
        <main className="min-h-screen w-full flex items-center justify-center p-4 font-sans text-slate-800 bg-gradient-to-br from-[var(--color-bg-gradient-from)] to-[var(--color-bg-gradient-to)]">
          <div className="w-full h-full transition-all duration-500">
            {renderContent()}
          </div>
        </main>
      </AuthContext.Provider>
    </ThemeProvider>
  );
};

export default App;