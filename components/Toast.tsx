import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast: React.FC = () => {
  const { notifications, dismissNotification } = useAppStore();

  return (
    <div className="fixed top-24 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="pointer-events-auto min-w-[300px] bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 p-4 shadow-2xl flex items-start gap-3"
          >
            {n.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            ) : (
                <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
            )}
            <div className="flex-grow">
                <p className="text-sm text-white font-medium leading-tight">{n.message}</p>
            </div>
            <button 
                onClick={() => dismissNotification(n.id)}
                className="text-neutral-500 hover:text-white"
            >
                <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;