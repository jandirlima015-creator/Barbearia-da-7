import { useEffect, useState } from 'react';
import { AuthProvider } from './hooks/useAuth';
import Home from './pages/Home';
import { Landing } from './pages/Landing';
import { seedDatabase } from './lib/seed';

export default function App() {
  const [view, setView] = useState<'landing' | 'home'>('landing');

  useEffect(() => {
    seedDatabase().catch(console.error);
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-ink">
        {view === 'landing' ? (
          <Landing onExplore={() => setView('home')} />
        ) : (
          <Home />
        )}
      </div>
    </AuthProvider>
  );
}
