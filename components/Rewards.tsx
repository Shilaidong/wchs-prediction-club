import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store';
import { Gift, Lock } from 'lucide-react';

const Rewards: React.FC = () => {
  const { rewards, user, redeemReward } = useAppStore();

  return (
    <div className="pt-24 pb-32 container mx-auto px-6">
        <div className="mb-12">
            <h1 className="font-display text-4xl md:text-5xl text-white mb-4">Rewards Vault</h1>
            <p className="text-neutral-400">Convert your foresight into tangible value.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward, idx) => {
                const canAfford = user && user.points >= reward.cost;
                return (
                    <motion.div
                        key={reward.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative bg-neutral-900 border border-white/5 overflow-hidden flex flex-col"
                    >
                        <div className="aspect-[4/3] overflow-hidden relative">
                             <img 
                                src={reward.image} 
                                alt={reward.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                             
                             <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                <span className={`text-xs font-bold tracking-wider ${canAfford ? 'text-yellow-500' : 'text-neutral-500'}`}>
                                    {reward.cost} PTS
                                </span>
                             </div>
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="font-display text-xl text-white mb-2">{reward.name}</h3>
                            <p className="text-sm text-neutral-500 mb-6 flex-grow">{reward.description}</p>
                            
                            <button
                                onClick={() => redeemReward(reward.id)}
                                disabled={!canAfford}
                                className={`w-full py-3 px-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest border transition-all ${
                                    canAfford 
                                    ? 'bg-white text-black border-white hover:bg-neutral-200' 
                                    : 'bg-transparent text-neutral-600 border-neutral-800 cursor-not-allowed'
                                }`}
                            >
                                {canAfford ? (
                                    <>
                                        <Gift className="w-4 h-4" /> Redeem
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" /> Insufficient Pts
                                    </>
                                )}
                            </button>
                            <div className="mt-3 text-center">
                                <span className="text-[10px] text-neutral-700 uppercase tracking-wider">
                                    {reward.remaining} Remaining
                                </span>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    </div>
  );
};

export default Rewards;