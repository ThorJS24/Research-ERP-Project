import React, { useState, useEffect } from 'react'
import RohitPage from './pages/rohitpage'
import ElnaPage from './pages/ElnaPage'
import HemantPage from './pages/hemantpage'
import Login from './login/login'
import authService from './login/authService' // Import the auth service
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('conferences');
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in when app starts
  useEffect(() => {
    const checkAuthStatus = () => {
      const loggedIn = authService.isLoggedIn();
      setIsLoggedIn(loggedIn);
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Clear auth service session
    authService.logout();
    setIsLoggedIn(false);
    setCurrentPage('conferences'); // Reset to default page on logout
  };

  const handlePageNavigation = (page) => {
    console.log('App.jsx - Navigating to:', page); // Debug log
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'conferences':
        return <RohitPage onNavigate={handlePageNavigation} onLogout={handleLogout} />;
      case 'publications':
      case 'research-papers':
        return <ElnaPage onNavigate={handlePageNavigation} onLogout={handleLogout} />;
      case 'journals':
        return <HemantPage onNavigate={handlePageNavigation} onLogout={handleLogout} />;
      default:
        return <RohitPage onNavigate={handlePageNavigation} onLogout={handleLogout} />;
    }
  };

  // Show loading screen while checking auth status
  if (isLoading) {
    return (
      <div className="App">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #e8f4fd 0%, #c8e6fc 50%, #a8d5fb 100%)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <div style={{
            textAlign: 'center',
            color: '#1976d2'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e3f2fd',
              borderTop: '4px solid #1976d2',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p>Loading...</p>
          </div>
        </div>
        
        {/* Add the spin animation for loading spinner */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show login page if not logged in
  if (!isLoggedIn) {
    return (
      <div className="App">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  // Show main app if logged in
  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

export default App