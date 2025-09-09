import React, { useState } from 'react'
import RohitPage from './pages/rohitpage'
import ElnaPage from './pages/ElnaPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('conferences');

  const handlePageNavigation = (page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'conferences':
        return <RohitPage onNavigate={handlePageNavigation} />;
      case 'publications':
      case 'research-papers':
        return <ElnaPage onNavigate={handlePageNavigation} />;
      default:
        return <RohitPage onNavigate={handlePageNavigation} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

export default App