import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Topic } from '../types';
import { ArrowUpRight, Clock, Users, LayoutGrid, ChevronDown } from 'lucide-react';

interface TopicFeedProps {
  topics: Topic[];
  onSelectTopic: (topic: Topic) => void;
}

const TopicCard: React.FC<{ topic: Topic; onClick: () => void; index: number }> = ({ topic, onClick, index }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            onClick={onClick}
            className="group relative w-full h-[500px] cursor-pointer overflow-hidden bg-neutral-900 border border-white/5"
        >
            {/* Background Image with Reveal Effect */}
            <div className="absolute inset-0">
                <img 
                    src={topic.image} 
                    alt={topic.title} 
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <span className="px-3 py-1 text-[10px] uppercase tracking-widest border border-white/20 bg-black/30 backdrop-blur-md rounded-full">
                        {topic.category}
                    </span>
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-md group-hover:bg-white group-hover:text-black transition-colors duration-300">
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                </div>

                <div>
                    <h3 className="font-display text-3xl mb-4 leading-tight group-hover:text-blue-300 transition-colors">
                        {topic.title}
                    </h3>
                    <div className="flex items-center gap-6 text-neutral-400 text-xs tracking-wide">
                        <div className="flex items-center gap-2">
                            <Users className="w-3 h-3" />
                            {topic.participants}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {new Date(topic.endTime).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                        </div>
                        <div className="text-yellow-500 font-bold ml-auto">
                            {topic.poolSize.toLocaleString()} PTS
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Animated Border */}
            <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-all duration-500 pointer-events-none" />
        </motion.div>
    );
};

const TopicFeed: React.FC<TopicFeedProps> = ({ topics, onSelectTopic }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Show only first 3 if not expanded
  const displayedTopics = expanded ? topics : topics.slice(0, 3);

  return (
    <div className="py-24 w-full relative min-h-screen">
        <div className="container mx-auto px-6 mb-12 flex items-end justify-between">
            <div>
                <motion.h2 layout className="font-display text-4xl mb-2">
                    {expanded ? "All Markets" : "Active Markets"}
                </motion.h2>
                <div className="h-1 w-24 bg-blue-600"></div>
            </div>
            <div className="hidden md:block text-right">
                <p className="text-neutral-500 text-sm max-w-xs">
                    Predict the outcome of campus events. <br/>High risk, high reward.
                </p>
            </div>
        </div>

        {/* Grid Layout for Cards */}
        <motion.div 
            layout
            className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            <AnimatePresence mode='popLayout'>
                {displayedTopics.map((topic, idx) => (
                    <TopicCard 
                        key={topic.id} 
                        topic={topic} 
                        index={idx}
                        onClick={() => onSelectTopic(topic)} 
                    />
                ))}
            </AnimatePresence>
        </motion.div>

        {/* Expand / Collapse Control */}
        {!expanded && topics.length > 3 && (
             <div className="flex justify-center mt-20">
                <button 
                    onClick={() => setExpanded(true)}
                    className="group relative px-10 py-5 bg-transparent border border-white/10 hover:border-white/30 transition-all overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <div className="relative flex items-center gap-4">
                        <span className="font-display text-sm tracking-[0.2em] uppercase">View All Markets</span>
                        <LayoutGrid className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                    </div>
                </button>
             </div>
        )}

        {expanded && (
             <div className="flex justify-center mt-20">
                 <button 
                    onClick={() => setExpanded(false)}
                    className="text-neutral-500 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest transition-colors"
                >
                    <ChevronDown className="w-4 h-4 rotate-180" />
                    Show Less
                </button>
             </div>
        )}
    </div>
  );
};

export default TopicFeed;