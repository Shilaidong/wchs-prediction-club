import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Category } from '../types';
import { useAppStore } from '../store';
import { Sparkles, Calendar } from 'lucide-react';

interface CreateTopicProps {
    onClose: () => void;
}

const CreateTopic: React.FC<CreateTopicProps> = ({ onClose }) => {
  const { createTopic } = useAppStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>(Category.CUSTOM);
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTopic({
        title,
        description,
        category,
        endTime: new Date(endTime).toISOString()
    });
    onClose();
  };

  return (
    <div className="pt-24 pb-32 container mx-auto px-6 max-w-3xl">
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
         >
            <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs uppercase tracking-widest mb-4">
                    <Sparkles className="w-3 h-3" />
                    <span>Create Market</span>
                </div>
                <h1 className="font-display text-4xl md:text-5xl text-white mb-4">Launch a Prediction</h1>
                <p className="text-neutral-400">Set the terms. Spark the debate. Earn commissions on volume.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-neutral-900/50 backdrop-blur-sm border border-white/10 p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="col-span-2">
                        <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-3">Topic Title</label>
                        <input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 p-4 text-white text-lg focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="e.g. Will the Fire Alarm go off today?"
                            required
                        />
                    </div>
                    
                    <div className="col-span-2">
                        <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-3">Description</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 p-4 text-white focus:outline-none focus:border-blue-500 transition-colors h-32 resize-none"
                            placeholder="Provide details about criteria for resolution..."
                            required
                        />
                    </div>

                    <div>
                         <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-3">Category</label>
                         <select 
                            value={category}
                            onChange={(e) => setCategory(e.target.value as Category)}
                            className="w-full bg-black/50 border border-white/10 p-4 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                         >
                            {Object.values(Category).map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                         </select>
                    </div>

                    <div>
                         <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-3">End Time</label>
                         <div className="relative">
                            <input 
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 p-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                required
                            />
                            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5 pointer-events-none" />
                         </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                    <p className="text-xs text-neutral-600">
                        * Markets are subject to community guidelines.
                    </p>
                    <button 
                        type="submit"
                        className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                    >
                        Publish Market
                    </button>
                </div>
            </form>
         </motion.div>
    </div>
  );
};

export default CreateTopic;