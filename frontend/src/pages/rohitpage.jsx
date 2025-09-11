import React, { useState } from 'react';
import Sidebar from './Sidebar';
import FormsFormat from '../forms/formformat';
import './rohitpage.css';

const RohitPage = ({ onNavigate }) => {
  const [expandedItems, setExpandedItems] = useState({
    home: false,
    conferences: true,
    profile: true,
    department: false,
    year: false,
    work: false,
    publications: false,
    access: false
  });

  const [currentPage, setCurrentPage] = useState('conferences');
  const [activeSubItem, setActiveSubItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showForms, setShowForms] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    participants: '',
    date: '',
    icon: '💻'
  });
  const [conferences, setConferences] = useState([
    {
      id: 1,
      icon: "💻",
      name: "ResNet for X-ray Detection",
      description: "A deep learning model applied to X-ray classification for disease detection.",
      people: 40,
      date: "01.03.23",
      participants: "Participants",
      dueDate: "Event date",
      tags: ["🔴", "🟡", "🔵", "🟢"]
    },
    {
      id: 2,
      icon: "🧠",
      name: "AI in Medical Imaging",
      description: "Symposium on AI-based image recognition at international level.",
      people: 60,
      date: "05.05.23",
      participants: "Participants",
      dueDate: "Event date",
      tags: ["🟢", "🔵", "🟡", "🔴"]
    },
    {
      id: 3,
      icon: "📡",
      name: "IoT-Based Smart Irrigation",
      description: "Presented a smart agricultural monitoring system using IoT sensors.",
      people: 30,
      date: "08.02.23",
      participants: "Participants",
      dueDate: "Due date",
      tags: ["🔴", "🟡", "🔵"]
    },
    {
      id: 4,
      icon: "⚡",
      name: "Deep Learning for Text Mining",
      description: "Discussed predictive analytics in text mining using CNN and RNN.",
      people: 35,
      date: "22.02.23",
      participants: "Participants",
      dueDate: "Due date",
      tags: ["🟢", "🔴", "🟡", "🔵"]
    },
    {
      id: 5,
      icon: "🌾",
      name: "AI in Crop Prediction",
      description: "Machine learning techniques for improving agricultural planning accuracy.",
      people: 25,
      date: "10.01.23",
      participants: "Participants",
      dueDate: "Due date",
      tags: ["🟢", "🔵", "🟡", "🔴"]
    },
    {
      id: 6,
      icon: "⚙️",
      name: "Edge AI for Maintenance",
      description: "Leveraging Edge AI for machinery failure prediction in industry.",
      people: 55,
      date: "18.03.23",
      participants: "Participants",
      dueDate: "Due date",
      tags: ["🟢", "🔴", "🔵", "🟡"]
    }
  ]);

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

  const handleNewEventClick = () => {
    setShowNewEventModal(true);
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (newEvent.name && newEvent.description && newEvent.participants && newEvent.date) {
      const newEventData = {
        id: conferences.length + 1,
        icon: newEvent.icon,
        name: newEvent.name,
        description: newEvent.description,
        people: parseInt(newEvent.participants),
        date: new Date(newEvent.date).toLocaleDateString('en-GB').replace(/\//g, '.'),
        participants: "Participants",
        dueDate: "Event date",
        tags: ["🟢", "🔵", "🟡", "🔴"]
      };
      
      setConferences([...conferences, newEventData]);
      setShowNewEventModal(false);
      setNewEvent({ name: '', description: '', participants: '', date: '', icon: '💻' });
    }
  };

  const handleFormsClick = () => {
    setShowForms(true);
  };

  const handleBackFromForms = () => {
    setShowForms(false);
  };

  const handleAppClick = () => {
    alert('App functionality - Navigate to applications');
  };

  const handleMessagesClick = () => {
    alert('Messages functionality - Open messaging system');
  };

  const handleSettingsClick = () => {
    alert('Settings functionality - Open settings panel');
  };

  const filteredConferences = conferences.filter(conference =>
    conference.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conference.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If Forms is active, render FormsFormat component
  if (showForms) {
    return (
      <div className="forms-container">
        <div className="forms-header">
          <button className="back-btn" onClick={handleBackFromForms}>
            ← Back to Dashboard
          </button>
        </div>
        <FormsFormat />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar 
        expandedItems={expandedItems}
        toggleExpanded={toggleExpanded}
        currentPage={currentPage}
        handleNavigation={handleNavigation}
        activeSubItem={activeSubItem}
        setActiveSubItem={handleSubItemClick}
        onNavigate={onNavigate}
      />

      <div className="main-content">
        <div className="blue-header">
          <h1 className="main-title">Research Conferences & Publications</h1>
          <div className="search-container">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search anything here..."
              value={searchQuery}
              onChange={handleSearch}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="content-container">
          <div className="content-header">
            <div className="user-section">
              <div className="user-pic">
                <img src="dr-deepak.jpg" alt="Dr. Deepak" />
              </div>
              <div className="user-details">
                <h3>Dr. deepak</h3>
                <p>(Doctor of Research)</p>
              </div>
            </div>
            <div className="action-buttons">
              <button className="header-btn secondary" onClick={handleFormsClick}>Forms</button>
              <button className="header-btn primary" onClick={handleAppClick}>App</button>
              <button className="header-btn secondary" onClick={handleMessagesClick}>Messages</button>
              <button className="header-btn secondary" onClick={handleSettingsClick}>Settings</button>
            </div>
          </div>

          <div className="events-container">
            <div className="section-header">
              <h2 className="section-title">Upcoming Academic Events</h2>
            </div>

            <div className="cards-grid">
              {filteredConferences.map((conference) => (
                <div key={conference.id} className="event-card">
                  <button className="card-menu" onClick={() => alert(`Options for ${conference.name}`)}>⋮</button>
                  <div className="card-top">
                    <div className="card-icon">{conference.icon}</div>
                    <div className="card-info">
                      <div className="card-title">{conference.name}</div>
                      <div className="card-tags">
                        {conference.tags.map((tag, index) => (
                          <span key={index} className="status-dot">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="card-description">{conference.description}</div>
                  <div className="card-footer">
                    <div className="card-stat">
                      <strong>{conference.people}</strong>
                      <span>{conference.participants}</span>
                    </div>
                    <div className="card-stat">
                      <strong>{conference.date}</strong>
                      <span>{conference.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredConferences.length === 0 && searchQuery && (
              <div className="no-results">
                <p>No events found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <button className="floating-btn" onClick={handleNewEventClick}>
        New Event
      </button>

      {showNewEventModal && (
        <div className="modal-overlay" onClick={() => setShowNewEventModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Academic Event</h2>
              <button className="close-btn" onClick={() => setShowNewEventModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateEvent} className="event-form">
              <div className="form-group">
                <label>Event Icon</label>
                <select 
                  value={newEvent.icon} 
                  onChange={(e) => setNewEvent({...newEvent, icon: e.target.value})}
                >
                  <option value="💻">💻 Computer</option>
                  <option value="🧠">🧠 AI/Brain</option>
                  <option value="📡">📡 IoT</option>
                  <option value="⚡">⚡ Energy</option>
                  <option value="🌾">🌾 Agriculture</option>
                  <option value="⚙️">⚙️ Engineering</option>
                  <option value="🔬">🔬 Research</option>
                  <option value="📊">📊 Data</option>
                </select>
              </div>
              <div className="form-group">
                <label>Event Name *</label>
                <input 
                  type="text" 
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                  placeholder="Enter event name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea 
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Enter event description"
                  required
                ></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expected Participants *</label>
                  <input 
                    type="number" 
                    value={newEvent.participants}
                    onChange={(e) => setNewEvent({...newEvent, participants: e.target.value})}
                    placeholder="0"
                    required
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Event Date *</label>
                  <input 
                    type="date" 
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowNewEventModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="create-btn">
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RohitPage;