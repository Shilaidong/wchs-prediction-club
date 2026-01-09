import React from 'react';
import { motion } from 'framer-motion';
import { Home, TrendingUp, Gift, User, Plus } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  points: number;
  isLoggedIn: boolean;
  onLoginClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setCurrentView, points, isLoggedIn, onLoginClick }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Hub' },
    { id: 'rewards', icon: Gift, label: 'Rewards' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <>
      {/* Top Brand Indicator */}
      <div className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-40 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto mix-blend-difference text-white">
           <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
             <span className="font-display text-lg font-bold">W</span>
           </div>
           <span className="hidden md:block font-display tracking-widest text-xs opacity-70">CHURCHILL PREDICT</span>
        </div>
        
        <div className="flex items-center gap-4 pointer-events-auto">
            {isLoggedIn ? (
              <div className="px-4 py-2 border border-white/10 rounded-full bg-black/40 backdrop-blur-md shadow-lg">
                  <span className="text-xs tracking-wider text-yellow-500 font-bold">{points.toLocaleString()} PTS</span>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="px-6 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors rounded-full"
              >
                Login
              </button>
            )}
        </div>
      </div>

      {/* Floating Bottom Navigation (Island) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2 p-2 bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-black/80"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`relative px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                currentView === item.id 
                  ? 'bg-white text-black' 
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {currentView === item.id && (
                <motion.span 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  className="text-xs font-bold tracking-wide whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          ))}
          
          {/* Create Button */}
          <div className="w-[1px] h-6 bg-white/10 mx-1" />
          <button
             onClick={() => setCurrentView('create')}
             className={`p-3 rounded-full transition-all duration-300 ${
                currentView === 'create'
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)]'
                  : 'bg-white/5 text-white hover:bg-white/10'
             }`}
          >
            <Plus className="w-5 h-5" />
          </button>

        </motion.div>
      </div>
    </>
  );
};

export default Navigation;