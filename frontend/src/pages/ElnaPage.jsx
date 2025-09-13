import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import './ElnaPage.css';

const ElnaPage = ({ onNavigate }) => {
  const [expandedItems, setExpandedItems] = useState({
    home: false,
    conferences: false,
    profile: false,
    department: false,
    year: false,
    work: false,
    publications: true,
    access: false
  });

  const [currentPage, setCurrentPage] = useState('publications');
  const [activeSubItem, setActiveSubItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Chart refs
  const publicationsTrendRef = useRef(null);
  const interactionChartRef = useRef(null);
  const activeDaysChartRef = useRef(null);

  const toggleExpanded = (item) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const handleSubItemClick = (subItemLabel) => {
    setActiveSubItem(subItemLabel);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Initialize charts when component mounts
  useEffect(() => {
    // Load Chart.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => {
      initializeCharts();
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initializeCharts = () => {
    if (window.Chart) {
      // Publications Trend Chart
      if (publicationsTrendRef.current) {
        new window.Chart(publicationsTrendRef.current, {
          type: 'line',
          data: {
            labels: ['25.02', '26.02', '27.02', '28.02', '29.02'],
            datasets: [{
              label: 'Journal',
              data: [100, 120, 500, 300, 200],
              borderColor: '#ea4335',
              backgroundColor: 'rgba(234, 67, 53, 0.1)',
              fill: false,
              tension: 0.4
            }, {
              label: 'Conference',
              data: [150, 100, 50, 100, 80],
              borderColor: '#5e5ce6',
              backgroundColor: 'rgba(94, 92, 230, 0.1)',
              fill: false,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top'
              }
            }
          }
        });
      }

      // Interaction chart
      if (interactionChartRef.current) {
        new window.Chart(interactionChartRef.current, {
          type: 'line',
          data: {
            labels: ['25.02', '26.02', '27.02', '28.02', '29.02'],
            datasets: [{
              data: [50, 150, 80, 30, 120],
              borderColor: '#5e5ce6',
              backgroundColor: 'rgba(94, 92, 230, 0.1)',
              fill: false,
              tension: 0.4,
              borderDash: [5, 5]
            }, {
              data: [30, 100, 60, 140, 90],
              borderColor: '#ea4335',
              backgroundColor: 'rgba(234, 67, 53, 0.1)',
              fill: false,
              tension: 0.4,
              borderDash: [10, 5]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 250
              }
            }
          }
        });
      }

      // Most Active Research Days
      if (activeDaysChartRef.current) {
        new window.Chart(activeDaysChartRef.current, {
          type: 'bar',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              data: [200, 50, 100, 80, 180, 60, 120],
              backgroundColor: ['#1a73e8', '#1a73e8', '#1a73e8', '#1a73e8', '#1a73e8', '#1a73e8', '#1a73e8']
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar 
        expandedItems={expandedItems}
        toggleExpanded={toggleExpanded}
        currentPage={currentPage}
        handleNavigation={handleNavigation}
        activeSubItem={activeSubItem}
        setActiveSubItem={handleSubItemClick}
        onNavigate={onNavigate}
      />

      {/* Main Dashboard */}
      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <h2>Research Papers Dashboard overview</h2>
          <div className="dashboard-searchbar">
            <input 
              type="text" 
              placeholder="Search anything here..."
              value={searchQuery}
              onChange={handleSearch}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        {/* Top KPI Cards Row */}
        <div className="top-cards-row">
          <div className="kpi-card">
            <div className="kpi-chart">
              <svg viewBox="0 0 100 40" className="mini-line-chart">
                <polyline points="0,30 20,25 40,15 60,20 80,10 100,5" stroke="#5e5ce6" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <div className="kpi-content">
              <div className="kpi-number">635</div>
              <div className="kpi-change">+21.01%</div>
              <div className="kpi-label">Total Publications</div>
            </div>
          </div>
          
          <div className="kpi-card">
            <div className="kpi-chart">
              <svg viewBox="0 0 100 40" className="mini-line-chart">
                <polyline points="0,35 20,30 40,20 60,15 80,25 100,10" stroke="#34a853" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <div className="kpi-content">
              <div className="kpi-number">123</div>
              <div className="kpi-change">+4.39%</div>
              <div className="kpi-label">Active Research Projects</div>
            </div>
          </div>
          
          <div className="kpi-card">
            <div className="kpi-chart">
              <svg viewBox="0 0 100 40" className="mini-line-chart">
                <polyline points="0,20 20,15 40,25 60,10 80,15 100,30" stroke="#1a73e8" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <div className="kpi-content">
              <div className="kpi-number">23%</div>
              <div className="kpi-change">-7.9%</div>
              <div className="kpi-label">Average Citation Rate</div>
            </div>
          </div>
        </div>

        {/* Middle Row - Publications Trend & Research Activities */}
        <div className="middle-row">
          <div className="chart-card large">
            <div className="card-header">
              <h4>Publications Trend</h4>
              <div className="legend">
                <span className="legend-item">
                  <div className="legend-color" style={{backgroundColor: '#ea4335'}}></div>
                  Journal
                </span>
                <span className="legend-item">
                  <div className="legend-color" style={{backgroundColor: '#5e5ce6'}}></div>
                  Conference
                </span>
              </div>
            </div>
            <canvas ref={publicationsTrendRef} className="chart"></canvas>
          </div>
          
          <div className="research-activities-card">
            <h4>Research Activities</h4>
            <div className="activities-list">
              <div className="activity-item">
                <span>Proposals Submitted</span>
                <span className="activity-number">250</span>
              </div>
              <div className="activity-item">
                <span>Projects Approved</span>
                <span className="activity-number">115</span>
              </div>
              <div className="activity-item">
                <span>Collaborations</span>
                <span className="activity-number">67</span>
              </div>
              <div className="activity-item">
                <span>Funding Received</span>
                <span className="activity-number">164</span>
              </div>
              <div className="activity-item">
                <span>Papers Under Review</span>
                <span className="activity-number">170</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Interaction & Most Active Days */}
        <div className="bottom-row">
          <div className="chart-card">
            <h4>Interaction</h4>
            <canvas ref={interactionChartRef} className="chart"></canvas>
          </div>
          
          <div className="chart-card">
            <div className="card-header">
              <h4>Most Active Research Days</h4>
              <div className="day-tabs">
                <span className="tab active">Hours</span>
                <span className="tab">Days</span>
              </div>
            </div>
            <canvas ref={activeDaysChartRef} className="chart"></canvas>
          </div>
        </div>
      </div>

      {/* Profile Sidebar */}
      <div className="dashboard-profile">
        <img src="dr-deepak.jpg" alt="Profile" />
        <h4>Dr. John Doe</h4>
        <p><strong>Research Grant Status</strong></p>
        <div className="progress-bar">
          <div className="progress-bar-fill"></div>
        </div>
        <h4>Hashtags sets</h4>
        <div className="hashtags">
          <p>Research Areas</p>
          <span>#AI</span><span>#Science</span><span>#Robotics</span>
          <p>Publication Type</p>
          <span>#journal</span><span>#conference</span><span>#book</span>
          <p>Collaboration Type</p>
          <span>#local</span><span>#international</span>
          <span>#government</span><span>#private</span>
        </div>
      </div>
    </div>
  );
};

export default ElnaPage;