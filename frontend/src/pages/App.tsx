import { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import UseCaseOverview from './UseCaseOverview';
import LoginModal from '../components/LoginModal';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { UseCase, User } from '../types';
import { useCaseApi } from '../services';
import { messages } from '../config';

type Screen = 'landing' | 'overview';
function AppContent() {
  const { login, logout, isAuthenticated } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const fetchUseCases = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await useCaseApi.getAllUseCases();
      setUseCases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : messages.errors.loadUseCases);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentScreen === 'overview' && isAuthenticated()) {
      void fetchUseCases();
    }
  }, [currentScreen, isAuthenticated]);

  const handleStartJourney = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (token: string, user: User) => {
    login(token, user);
    setCurrentScreen('overview');
  };

  const handleBackToHome = () => {
    logout();
    setUseCases([]);
    setError(null);
    setIsLoginModalOpen(false);
    setCurrentScreen('landing');
  };

  return (
    <>
      {currentScreen === 'landing' ? (
        <LandingPage onStartJourney={handleStartJourney} />
      ) : (
        <UseCaseOverview
          useCases={useCases}
          onBackToHome={handleBackToHome}
          isLoading={isLoading}
          error={error}
          onRefresh={fetchUseCases}
        />
      )}
        <LoginModal
        key={isLoginModalOpen ? 'open' : 'closed'}
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
