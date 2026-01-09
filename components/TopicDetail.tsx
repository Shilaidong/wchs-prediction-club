import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, AlertCircle } from 'lucide-react';
import { Topic } from '../types';
import { useAppStore } from '../store';

interface TopicDetailProps {
    topic: Topic;
    onClose: () => void;
}

const TopicDetail: React.FC<TopicDetailProps> = ({ topic, onClose }) => {
    const { makePrediction, user } = useAppStore();
    const [amount, setAmount] = useState<number>(50);
    const [selection, setSelection] = useState<string | null>(null);

    const handlePredict = async () => {
        if (selection && amount > 0) {
            const success = await makePrediction(topic.id, selection, amount);
            if (success) onClose();
            else alert('Prediction failed. Check points or network.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                className="bg-[#0a0a0a] border border-white/10 w-full max-w-4xl overflow-hidden relative shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors z-20 bg-black/50 p-2 rounded-full backdrop-blur-sm"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Visual Side */}
                <div className="w-full md:w-1/2 h-48 md:h-auto relative">
                    <img
                        src={topic.image}
                        alt={topic.title}
                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0a0a0a]" />

                    <div className="absolute bottom-6 left-6 right-6">
                        <span className="inline-block px-3 py-1 mb-3 text-[10px] font-bold tracking-widest uppercase bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full">
                            {topic.category}
                        </span>
                        <h2 className="font-display text-3xl md:text-4xl leading-tight mb-2 shadow-black drop-shadow-lg">
                            {topic.title}
                        </h2>
                        <p className="text-neutral-300 text-sm shadow-black drop-shadow-md">
                            {topic.description}
                        </p>
                    </div>
                </div>

                {/* Interaction Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
                    {user ? (
                        <>
                            <div className="mb-8">
                                <div className="flex justify-between items-end mb-4">
                                    <span className="text-xs uppercase tracking-widest text-neutral-500">Make your call</span>
                                    <span className="text-xs text-yellow-500 font-bold">Balance: {user.points} PTS</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {['Yes', 'No'].map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => setSelection(opt)}
                                            className={`py-6 border transition-all relative overflow-hidden group ${selection === opt
                                                    ? 'bg-white text-black border-white'
                                                    : 'bg-transparent text-neutral-400 border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            <span className="relative z-10 text-lg font-bold uppercase tracking-wider">{opt}</span>
                                            {selection === opt && (
                                                <motion.div layoutId="sel" className="absolute inset-0 bg-white z-0" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-4">Wager Amount</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="10"
                                        max={user.points}
                                        step="10"
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        className="flex-grow h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full"
                                    />
                                    <div className="min-w-[80px] text-right text-2xl font-bold font-mono">{amount}</div>
                                </div>
                            </div>

                            <div className="bg-neutral-900 border border-white/5 p-4 mb-8">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-neutral-500">Odds</span>
                                    <span className="text-white">x{topic.odds.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500">Potential Payout</span>
                                    <span className="text-blue-400 font-bold">{(amount * topic.odds).toFixed(0)} PTS</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePredict}
                                disabled={!selection}
                                className={`w-full py-4 text-xs font-bold uppercase tracking-widest transition-colors ${selection
                                        ? 'bg-blue-600 text-white hover:bg-blue-500'
                                        : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                    }`}
                            >
                                Confirm Prediction
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                            <AlertCircle className="w-12 h-12 text-neutral-600" />
                            <p className="text-neutral-400">Please login to place predictions.</p>
                        </div>
                    )}

                    <div className="mt-auto pt-8 flex items-center justify-between text-[10px] text-neutral-600 uppercase tracking-widest border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <Trophy className="w-3 h-3" />
                            {topic.poolSize.toLocaleString()} In Pool
                        </div>
                        <div>
                            Ends {new Date(topic.endTime).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TopicDetail;