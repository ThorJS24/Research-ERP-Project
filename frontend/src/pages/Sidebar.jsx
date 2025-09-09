import React from 'react';

const Sidebar = ({ expandedItems, toggleExpanded, currentPage, handleNavigation, activeSubItem, setActiveSubItem, onNavigate }) => {
  const menuItems = [
    { 
      id: 'home',
      icon: "🏠", 
      label: "Home", 
      arrow: expandedItems.home ? "▲" : "▼", 
      active: currentPage === 'home',
      expandable: true,
      key: 'home'
    },
    { 
      id: 'conferences',
      icon: "📊", 
      label: "Conferences", 
      arrow: expandedItems.conferences ? "▲" : "▼",
      active: currentPage === 'conferences',
      expandable: true,
      key: 'conferences',
      activeItem: currentPage === 'conferences',
      subItems: expandedItems.conferences ? [
        { label: "Active", active: activeSubItem === "Active" }
      ] : []
    },
    { 
      id: 'profile',
      icon: "👤", 
      label: "Profile", 
      arrow: expandedItems.profile ? "▲" : "▼",
      active: false,
      expandable: true,
      key: 'profile',
      subItems: expandedItems.profile ? [
        { label: "List View", active: activeSubItem === "List View" },
        { label: "Calendar View", active: activeSubItem === "Calendar View" },
        { label: "All Projects", active: activeSubItem === "All Projects" }
      ] : []
    },
    { 
      id: 'department',
      icon: "🏢", 
      label: "Department", 
      arrow: expandedItems.department ? "▲" : "▼",
      expandable: true,
      key: 'department'
    },
    { 
      id: 'year',
      icon: "📅", 
      label: "Year", 
      arrow: expandedItems.year ? "▲" : "▼",
      expandable: true,
      key: 'year'
    },
    { 
      id: 'symposium',
      label: "Symposium Type", 
      expandable: false,
      noIcon: true
    },
    { 
      id: 'role',
      label: "Role (Author/Co-author)", 
      expandable: false,
      noIcon: true
    },
    { 
      id: 'language',
      label: "Language", 
      expandable: false,
      noIcon: true
    },
    { 
      id: 'notification',
      label: "Notification", 
      expandable: false,
      noIcon: true
    },
    { 
      id: 'chat',
      label: "Chat", 
      expandable: false,
      noIcon: true
    },
    { 
      id: 'work',
      icon: "🔬", 
      label: "Research Work", 
      arrow: expandedItems.work ? "▲" : "▼",
      expandable: true,
      key: 'work'
    },
    { 
      id: 'publications',
      icon: "📚", 
      label: "My Publications", 
      arrow: expandedItems.publications ? "▲" : "▼",
      expandable: true,
      key: 'publications',
      active: currentPage === 'publications',
      activeItem: currentPage === 'publications'
    }
  ];

  const handleItemClick = (item) => {
    if (item.expandable && item.key) {
      toggleExpanded(item.key);
    }
    
    if (item.id) {
      handleNavigation(item.id);
      
      // Navigate to specific pages
      if (item.id === 'publications' && onNavigate) {
        onNavigate('publications');
      } else if (item.id === 'conferences' && onNavigate) {
        onNavigate('conferences');
      } else if (onNavigate) {
        onNavigate(item.id);
      }
    }
  };

  return (
    <aside className="side">
      <div className="logo">
        <img src="christlogo.jpg" alt="Christ University Logo" className="logoimg" />
      </div>
      <nav className="menu">
        {menuItems.map((item, index) => (
          <div key={index}>
            <div 
              className={`item ${item.active || item.activeItem ? 'on' : ''} ${item.noIcon ? 'no-icon' : ''}`}
              onClick={() => handleItemClick(item)}
            >
              {item.icon && <span className="ico">{item.icon}</span>}
              <span>{item.label}</span>
              {item.arrow && <span className="arrow">{item.arrow}</span>}
            </div>
            {item.subItems && item.subItems.map((subItem, subIndex) => (
              <div 
                key={subIndex} 
                className={`sub-item ${subItem.active ? 'active' : ''}`}
                onClick={() => setActiveSubItem(subItem.label)}
              >
                {subItem.label}
              </div>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;