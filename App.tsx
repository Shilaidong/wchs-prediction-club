import React, { useState } from 'react';
import { AppProvider, useAppStore } from './store';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import TopicFeed from './components/TopicFeed';
import Profile from './components/Profile';
import Rewards from './components/Rewards';
import CreateTopic from './components/CreateTopic';
import TopicDetail from './components/TopicDetail';
import Auth from './components/Auth';
import Toast from './components/Toast';
import { AnimatePresence, motion } from 'framer-motion';
import { Topic } from './types';

// Inner component to use Store
const AppContent = () => {
  const { user, topics } = useAppStore();
  const [currentView, setCurrentView] = useState('home');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  // If user tries to create topic without login, show auth
  const handleViewChange = (view: string) => {
    if ((view === 'create' || view === 'profile') && !user) {
        setShowAuth(true);
        return;
    }
    setCurrentView(view);
  };

  const handleTopicSelect = (topic: Topic) => {
      setSelectedTopic(topic);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 selection:bg-blue-500 selection:text-white">
      <Toast />
      
      <Navigation 
        currentView={currentView} 
        setCurrentView={handleViewChange} 
        points={user?.points || 0}
        isLoggedIn={!!user}
        onLoginClick={() => setShowAuth(true)}
      />

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Hero />
              <TopicFeed 
                topics={topics} 
                onSelectTopic={handleTopicSelect} 
              />
               {/* Footer */}
               <div className="py-20 text-center border-t border-white/5">
                <p className="font-display text-neutral-600 text-sm">WINSTON CHURCHILL HIGH SCHOOL</p>
                <p className="text-neutral-800 text-xs mt-2 uppercase tracking-widest">Student Run • Unofficial • 2025</p>
              </div>
            </motion.div>
          )}

          {currentView === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Profile />
            </motion.div>
          )}

          {currentView === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Rewards />
            </motion.div>
          )}

           {currentView === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <CreateTopic onClose={() => setCurrentView('home')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {selectedTopic && (
            <TopicDetail topic={selectedTopic} onClose={() => setSelectedTopic(null)} />
        )}
        {showAuth && (
            <Auth onClose={() => setShowAuth(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
        <AppContent />
    </AppProvider>
  );
}

export default App;