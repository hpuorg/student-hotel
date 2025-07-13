import React, { useState, useMemo } from 'react';
import { Helmet } from '@modern-js/runtime/head';
import { Link } from '@modern-js/runtime/router';
import './index.css';

// App interface
interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  category: string;
  color: string;
  isActive: boolean;
}

// Apps data
const apps: App[] = [
  {
    id: 'student-hotel',
    name: 'Student Hotel',
    description: 'Comprehensive student accommodation management system with room booking, maintenance, and billing features.',
    icon: '🏨',
    path: '/student-hotel',
    category: 'Management',
    color: 'bg-blue-500',
    isActive: true,
  },
  // Placeholder for future apps
  {
    id: 'coming-soon-1',
    name: 'Finance Manager',
    description: 'Financial management and accounting system for tracking expenses, revenue, and financial reports.',
    icon: '💰',
    path: '#',
    category: 'Finance',
    color: 'bg-green-500',
    isActive: false,
  },
  {
    id: 'coming-soon-2',
    name: 'HR Portal',
    description: 'Human resources management system for employee records, payroll, and performance tracking.',
    icon: '👥',
    path: '#',
    category: 'Human Resources',
    color: 'bg-purple-500',
    isActive: false,
  },
  {
    id: 'coming-soon-3',
    name: 'Inventory System',
    description: 'Inventory and asset management system for tracking supplies, equipment, and maintenance schedules.',
    icon: '📦',
    path: '#',
    category: 'Operations',
    color: 'bg-orange-500',
    isActive: false,
  },
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter apps based on search query
  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) return apps;

    const query = searchQuery.toLowerCase();
    return apps.filter(app =>
      app.name.toLowerCase().includes(query) ||
      app.description.toLowerCase().includes(query) ||
      app.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="dashboard-container">
      <Helmet>
        <title>Dashboard - Master App</title>
        <link
          rel="icon"
          type="image/x-icon"
          href="https://lf3-static.bytednsdoc.com/obj/eden-cn/uhbfnupenuhf/favicon.ico"
        />
      </Helmet>

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Welcome to Your Dashboard</h1>
            <p>Access all your applications from one central location</p>
          </div>
          <div className="user-info">
            <div className="user-avatar">
              <span>👤</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        {/* Apps Grid */}
        <div className="apps-section">
          <div className="apps-grid">
            {filteredApps.map((app) => (
              <div key={app.id} className={`app-card ${!app.isActive ? 'app-card-disabled' : ''}`}>
                {app.isActive ? (
                  <Link to={app.path} className="app-link">
                    <div className="app-content">
                      <div className={`app-icon ${app.color}`}>
                        <span className="app-emoji">{app.icon}</span>
                      </div>
                      <div className="app-info">
                        <h3 className="app-name">{app.name}</h3>
                        <p className="app-description">{app.description}</p>
                        <span className="app-category">{app.category}</span>
                      </div>
                      <div className="app-status">
                        <span className="status-active">Active</span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="app-content">
                    <div className={`app-icon ${app.color} opacity-50`}>
                      <span className="app-emoji">{app.icon}</span>
                    </div>
                    <div className="app-info">
                      <h3 className="app-name text-gray-500">{app.name}</h3>
                      <p className="app-description text-gray-400">{app.description}</p>
                      <span className="app-category text-gray-400">{app.category}</span>
                    </div>
                    <div className="app-status">
                      <span className="status-coming-soon">Coming Soon</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredApps.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No applications found</h3>
              <p>Try adjusting your search terms or browse all available apps.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
