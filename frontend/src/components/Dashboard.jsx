// src/components/Dashboard.jsx

import React, { useState } from 'react';
import SaveDocument from './SaveDocument';
import SearchDocument from './SearchDocument';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('save'); // Tracks which tab is active (Save or Search)

  return (
    <div>
      <h2>Welcome to your Dashboard!</h2>
      <div className="btn-group" role="group" aria-label="Document options">
        <button
          type="button"
          className={`btn btn-primary ${activeTab === 'save' ? 'active' : ''}`}
          onClick={() => setActiveTab('save')}
        >
          Save Document
        </button>
        <button
          type="button"
          className={`btn btn-secondary ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Search Document
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'save' && <SaveDocument />}
        {activeTab === 'search' && <SearchDocument />}
      </div>
    </div>
  );
};

export default Dashboard;
