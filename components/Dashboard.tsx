import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { User } from '../types';

interface DashboardProps {
    user: User;
}

const data = [
  { name: 'Mon', points: 400 },
  { name: 'Tue', points: 450 },
  { name: 'Wed', points: 420 },
  { name: 'Thu', points: 580 },
  { name: 'Fri', points: 580 },
  { name: 'Sat', points: 600 },
  { name: 'Sun', points: 650 },
];

const categoryData = [
  { name: 'Sports', value: 45 },
  { name: 'Weather', value: 30 },
  { name: 'Campus', value: 25 },
];

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="pt-32 pb-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* User Stat Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:col-span-4 bg-neutral-900/50 backdrop-blur-md border border-white/10 p-8 flex flex-col items-center text-center relative overflow-hidden"
            >
                <div className="w-24 h-24 rounded-full border-2 border-white/20 p-1 mb-6">
                    <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover grayscale" />
                </div>
                <h2 className="text-2xl font-display text-white mb-1">{user.name}</h2>
                <p className="text-blue-400 text-xs tracking-widest uppercase mb-6">{user.rank}</p>
                
                <div className="grid grid-cols-2 gap-4 w-full border-t border-white/10 pt-6">
                    <div>
                        <div className="text-3xl font-bold text-white">{user.points}</div>
                        <div className="text-xs text-neutral-500 uppercase tracking-wider">Net Worth</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white">82%</div>
                        <div className="text-xs text-neutral-500 uppercase tracking-wider">Accuracy</div>
                    </div>
                </div>
                {/* Decorative background blur */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            </motion.div>

            {/* Performance Chart */}
            <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="md:col-span-8 bg-neutral-900/50 backdrop-blur-md border border-white/10 p-8 min-h-[400px] flex flex-col"
            >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-display text-xl">Performance History</h3>
                    <select className="bg-transparent border border-white/20 text-xs text-neutral-400 px-3 py-1 rounded-full outline-none">
                        <option>This Week</option>
                        <option>This Month</option>
                    </select>
                </div>
                
                <div className="flex-grow w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}`} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                                itemStyle={{ color: '#3b82f6' }}
                            />
                            <Area type="monotone" dataKey="points" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPoints)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Portfolio Composition */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="md:col-span-6 bg-neutral-900/50 backdrop-blur-md border border-white/10 p-8"
            >
                <h3 className="font-display text-xl mb-8">Portfolio Distribution</h3>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" stroke="#a3a3a3" width={80} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                            <Bar dataKey="value" fill="#fff" barSize={20} radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

             {/* Redeem Section - The Hook */}
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="md:col-span-6 relative group cursor-pointer overflow-hidden border border-white/10"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 to-black z-0"></div>
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700" alt="Starbucks" />
                
                <div className="relative z-10 p-8 h-full flex flex-col justify-center items-start">
                    <h3 className="font-display text-3xl mb-2">Starbucks Rewards</h3>
                    <p className="text-neutral-400 mb-6 max-w-sm">Exchange 2000 PTS for a $10 Gift Card. Fuel your study sessions.</p>
                    <button className="px-6 py-3 bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors">
                        Visit Store
                    </button>
                </div>
            </motion.div>

        </div>
    </div>
  );
};

export default Dashboard;