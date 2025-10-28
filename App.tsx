import React, { useState, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import Backoffice from './components/Backoffice';
import LoginPage from './components/Login';
import { Lead, AppSettings } from './types';
import { MOCK_LEADS, INITIAL_COMPETITORS, INITIAL_OUR_PLAN, LANDING_PAGE_SAVINGS_PERCENTAGE } from './constants';

type View = 'landing' | 'login' | 'backoffice';

function App() {
  const [view, setView] = useState<View>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [appSettings, setAppSettings] = useState<AppSettings>({
    ourPlan: INITIAL_OUR_PLAN,
    competitors: INITIAL_COMPETITORS,
    landingPageSavingsPercentage: LANDING_PAGE_SAVINGS_PERCENTAGE,
  });


  const handleNewLead = useCallback((newLead: Lead) => {
    setLeads(prevLeads => [newLead, ...prevLeads]);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setView('backoffice');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('landing');
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setAppSettings(newSettings);
    // Here you would typically also save to a backend
  };

  const navigateToSellerArea = () => {
    if (isAuthenticated) {
        setView('backoffice');
    } else {
        setView('login');
    }
  };

  const renderView = () => {
    switch(view) {
        case 'landing':
            return <LandingPage onNewLead={handleNewLead} onBackofficeClick={navigateToSellerArea} settings={appSettings} />;
        case 'login':
            return <LoginPage onLoginSuccess={handleLoginSuccess} onBack={() => setView('landing')} />;
        case 'backoffice':
            if (isAuthenticated) {
                return <Backoffice leads={leads} onLogout={handleLogout} appSettings={appSettings} onSaveSettings={handleSaveSettings} />;
            }
            // If not authenticated, redirect to login
            return <LoginPage onLoginSuccess={handleLoginSuccess} onBack={() => setView('landing')} />;
        default:
             return <LandingPage onNewLead={handleNewLead} onBackofficeClick={navigateToSellerArea} settings={appSettings} />;
    }
  }
  
  return (
    <div className="App">
      {renderView()}
    </div>
  );
}

export default App;
