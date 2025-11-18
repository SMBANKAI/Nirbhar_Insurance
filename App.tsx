import React, { useState } from 'react';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import MainApp from './components/main/MainApp';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  const handleOnboardingComplete = () => {
    setOnboardingCompleted(true);
  };

  const handleLogout = () => {
    // Clear user-specific data to reset the app state
    localStorage.removeItem('nirbhar_chat_history');
    localStorage.removeItem('nirbhar_tour_completed');
    localStorage.removeItem('nirbhar_total_points');
    localStorage.removeItem('nirbhar_savings_reminder_time');
    
    setOnboardingCompleted(false);
  };

  return (
    <LanguageProvider>
      <div className="font-sans antialiased text-text-primary">
        {!onboardingCompleted ? (
          <OnboardingFlow onOnboardingComplete={handleOnboardingComplete} />
        ) : (
          <MainApp onLogout={handleLogout} />
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;