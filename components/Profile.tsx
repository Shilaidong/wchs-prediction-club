import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, History, Award } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, transactions, predictions, topics } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'predictions' | 'transactions'>('overview');

  if (!user) return <div className="pt-32 text-center">Please login to view profile.</div>;

  const userPredictions = predictions.filter(p => p.userId === user.id);
  // Fake graph data based on transactions
  const graphData = transactions.slice().reverse().map((t, i) => ({
      name: i.toString(),
      amount: t.amount
  }));

  return (
    <div className="pt-24 pb-32 container mx-auto px-6">
         <div className="flex flex-col md:flex-row gap-8 mb-12 items-start">
             {/* Profile Header */}
             <div className="w-full md:w-1/3 bg-neutral-900/50 border border-white/10 p-8 text-center relative overflow-hidden">
                <div className="w-32 h-32 mx-auto rounded-full border-2 border-white/20 p-1 mb-6">
                    <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover grayscale" />
                </div>
                <h2 className="text-3xl font-display text-white mb-1">{user.name}</h2>
                <p className="text-blue-500 text-xs tracking-widest uppercase mb-8">{user.rank}</p>
                <div className="text-5xl font-bold text-white mb-2">{user.points.toLocaleString()}</div>
                <p className="text-neutral-500 text-xs uppercase tracking-wider">Current Balance</p>
                
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500/50 to-transparent" />
             </div>

             {/* Stats & Nav */}
             <div className="w-full md:w-2/3">
                 <div className="grid grid-cols-3 gap-4 mb-8">
                     <div className="bg-white/5 border border-white/10 p-4 text-center">
                         <div className="text-2xl font-bold text-white">{userPredictions.length}</div>
                         <div className="text-[10px] text-neutral-500 uppercase tracking-widest">Bets Placed</div>
                     </div>
                     <div className="bg-white/5 border border-white/10 p-4 text-center">
                         <div className="text-2xl font-bold text-white">
                             {userPredictions.filter(p => p.status === 'won').length}
                         </div>
                         <div className="text-[10px] text-neutral-500 uppercase tracking-widest">Wins</div>
                     </div>
                     <div className="bg-white/5 border border-white/10 p-4 text-center">
                         <div className="text-2xl font-bold text-white">84%</div>
                         <div className="text-[10px] text-neutral-500 uppercase tracking-widest">Accuracy</div>
                     </div>
                 </div>

                 <div className="flex border-b border-white/10 mb-6">
                     {['overview', 'predictions', 'transactions'].map((tab) => (
                         <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors relative ${
                                activeTab === tab ? 'text-white' : 'text-neutral-600 hover:text-neutral-400'
                            }`}
                         >
                             {tab}
                             {activeTab === tab && (
                                 <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500" />
                             )}
                         </button>
                     ))}
                 </div>

                 <div className="min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div 
                                key="overview"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="h-64 w-full"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={graphData}>
                                        <defs>
                                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                                        />
                                        <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmount)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </motion.div>
                        )}

                        {activeTab === 'predictions' && (
                            <motion.div 
                                key="predictions"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {userPredictions.length === 0 && <div className="text-neutral-500 text-sm">No predictions yet.</div>}
                                {userPredictions.map(p => {
                                    const topic = topics.find(t => t.id === p.topicId);
                                    return (
                                        <div key={p.id} className="bg-white/5 border border-white/5 p-4 flex justify-between items-center">
                                            <div>
                                                <div className="text-sm text-white mb-1">{topic?.title}</div>
                                                <div className="text-xs text-neutral-500">Predicted: <span className="text-blue-400">{p.predictionValue}</span></div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-white">{p.wager} PTS</div>
                                                <div className="text-[10px] text-neutral-500 uppercase">{p.status}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </motion.div>
                        )}

                        {activeTab === 'transactions' && (
                            <motion.div 
                                key="transactions"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="space-y-2"
                            >
                                 {transactions.map(t => (
                                     <div key={t.id} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                                         <div className="flex items-center gap-3">
                                             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.amount > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                 {t.amount > 0 ? <TrendingUp className="w-4 h-4" /> : <History className="w-4 h-4" />}
                                             </div>
                                             <div>
                                                 <div className="text-sm text-neutral-300">{t.description}</div>
                                                 <div className="text-[10px] text-neutral-600">{new Date(t.createdAt).toLocaleDateString()}</div>
                                             </div>
                                         </div>
                                         <div className={`font-mono text-sm ${t.amount > 0 ? 'text-green-400' : 'text-neutral-400'}`}>
                                             {t.amount > 0 ? '+' : ''}{t.amount}
                                         </div>
                                     </div>
                                 ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                 </div>
             </div>
         </div>
    </div>
  );
};

export default Profile;