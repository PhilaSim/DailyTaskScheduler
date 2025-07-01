import React, { useState, useEffect } from 'react';
import { SignInPage } from './components/SignInPage';
import { Dashboard } from './components/Dashboard';
import { SettingsPage } from './components/SettingsPage';
import { User, Page } from './types';
import { storage } from './utils/storage';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('signin');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already signed in
    const storedUser = storage.getUser();
    if (storedUser) {
      setUser(storedUser);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleSignIn = (userData: User) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: 'dashboard' | 'settings') => {
    setCurrentPage(page);
  };

  const handleReset = () => {
    setUser(null);
    setCurrentPage('signin');
  };

  return (
    <div className="font-['Inter',sans-serif] antialiased">
      {currentPage === 'signin' && (
        <SignInPage onSignIn={handleSignIn} />
      )}
      
      {currentPage === 'dashboard' && user && (
        <Dashboard 
          user={user} 
          onNavigate={handleNavigate}
        />
      )}
      
      {currentPage === 'settings' && user && (
        <SettingsPage 
          user={user} 
          onNavigate={handleNavigate}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;