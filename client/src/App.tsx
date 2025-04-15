import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashPage from './pages/SplashPage';
import Dashboard from './pages/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Apply theme class to the document root whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    const themeColorMeta = document.getElementById('theme-color-meta');
    
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
      root.setAttribute('data-color-mode', 'dark');
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', '#1e1e2e');
      }
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
      root.setAttribute('data-color-mode', 'light');
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', '#ffffff');
      }
    }
  }, [isDarkMode]);
  
  return (
    <Router>
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
