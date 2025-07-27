import React, { useState, useEffect, useCallback } from 'react';
import { User } from './types';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import { getUserSession, saveUserSession, clearUserSession } from './services/storageService';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
    const [showSignUp, setShowSignUp] = useState<boolean>(false);

    useEffect(() => {
        try {
            const sessionUser = getUserSession();
            if (sessionUser) {
                setUser(sessionUser);
            }
        } catch (error) {
            console.error("Failed to load user session:", error);
            // In case of error, ensure session is cleared
            clearUserSession();
        } finally {
            setIsAuthReady(true);
        }
    }, []);

    const handleLogin = useCallback((loggedInUser: User) => {
        try {
            saveUserSession(loggedInUser);
            setUser(loggedInUser);
        } catch (error) {
            console.error("Failed to save user session:", error);
        }
    }, []);

    const handleLogout = useCallback(() => {
        try {
            clearUserSession();
            setUser(null);
        } catch (error) {
            console.error("Failed to clear user session:", error);
        }
    }, []);

    if (!isAuthReady) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p>Carregando...</p>
            </div>
        );
    }

    if (user) {
        return <Dashboard user={user} onLogout={handleLogout} />;
    }

    return showSignUp ? (
        <SignUpPage
            onSignUp={handleLogin}
            onSwitchToLogin={() => setShowSignUp(false)}
        />
    ) : (
        <LoginPage
            onLogin={handleLogin}
            // Adiciona botão para ir para cadastro
            // O LoginPage pode receber uma prop opcional para alternar
            switchToSignUp={() => setShowSignUp(true)}
        />
    );
};

export default App;