import React, { useState, useEffect } from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation,
} from 'react-router-dom';
import { Toaster } from 'sonner';
import io from 'socket.io-client';
import axios from 'axios';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import MatchingPage from './pages/MatchingPage';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AuthCallbackPage from './pages/AuthCallbackPage';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API = `${BACKEND_URL}/api`;

// Configure axios defaults
axios.defaults.baseURL = API;
axios.defaults.withCredentials = true;

// Socket connection
let socket = null;

function AuthHandler() {
    const { login, loading } = useAuth();
    const location = useLocation();

    useEffect(() => {
        // Check for session_id in URL fragment (from OAuth redirect)
        const fragment = window.location.hash;
        if (fragment.includes('session_id=')) {
            const sessionId = fragment.split('session_id=')[1].split('&')[0];

            if (sessionId) {
                // Process the session ID
                processSessionId(sessionId);
                // Clean the URL
                window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname
                );
            }
        }
    }, []);

    const processSessionId = async (sessionId) => {
        try {
            const response = await axios.get('/auth/session-data', {
                headers: { 'X-Session-ID': sessionId },
            });

            if (response.data) {
                // Set the session token cookie (handled by backend)
                await login(response.data);
                window.location.href = '/dashboard';
            }
        } catch (error) {
            console.error('Session processing failed:', error);
        }
    };

    return null;
}

function AppRoutes() {
    const { user, loading } = useAuth();

    if (loading) {
        return React.createElement(LoadingSpinner);
    }

    return React.createElement(Routes, null,
        React.createElement(Route, { path: '/', element: React.createElement(HomePage) }),
        React.createElement(Route, { path: '/about', element: React.createElement(AboutPage) }),
        React.createElement(Route, { path: '/how-it-works', element: React.createElement(HowItWorksPage) }),
        React.createElement(Route, {
            path: '/login',
            element: user ? React.createElement(Navigate, { to: '/dashboard' }) : React.createElement(LoginPage)
        }),
        React.createElement(Route, {
            path: '/register',
            element: user ? React.createElement(Navigate, { to: '/dashboard' }) : React.createElement(RegisterPage)
        }),
        React.createElement(Route, {
            path: '/dashboard',
            element: user ? React.createElement(DashboardPage) : React.createElement(Navigate, { to: '/login' })
        }),
        React.createElement(Route, {
            path: '/profile',
            element: user ? React.createElement(ProfilePage) : React.createElement(Navigate, { to: '/login' })
        }),
        React.createElement(Route, {
            path: '/matching',
            element: user ? React.createElement(MatchingPage) : React.createElement(Navigate, { to: '/login' })
        }),
        React.createElement(Route, { path: '/auth/callback', element: React.createElement(AuthCallbackPage) })
    );
}

function App() {
    const [socketConnected, setSocketConnected] = useState(false);

    useEffect(() => {
        // Initialize socket connection
        socket = io(BACKEND_URL, {
            transports: ['websocket', 'polling'],
        });

        socket.on('connect', () => {
            console.log('Socket connected');
            setSocketConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            setSocketConnected(false);
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    return React.createElement('div', { className: 'App' },
        React.createElement(BrowserRouter, null,
            React.createElement(AuthProvider, null,
                React.createElement(NotificationProvider, { socket: socket },
                    React.createElement(AuthHandler),
                    React.createElement('div', { className: 'min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50' },
                        React.createElement(Navbar),
                        React.createElement('main', { className: 'flex-1' },
                            React.createElement(AppRoutes)
                        ),
                        React.createElement(Footer)
                    ),
                    React.createElement(Toaster, {
                        position: 'top-right',
                        toastOptions: {
                            duration: 4000,
                            style: {
                                background: 'white',
                                color: '#374151',
                                border: '1px solid #e5e7eb',
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            },
                        }
                    })
                )
            )
        )
    );
}

export { socket };
export default App;