import React, { useState } from 'react'
import RohitPage from './pages/rohitpage'
import ElnaPage from './pages/ElnaPage'
import HemantPage from './pages/hemantpage'
import Login from './login/login'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('conferences');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
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