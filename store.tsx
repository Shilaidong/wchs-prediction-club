import React, { createContext, useContext, useState, useEffect } from 'react';
import { Topic, User, Prediction, Reward, Transaction, Redemption, Category } from './types';
import { supabase } from './services/supabase';

// Stylized geometric images for topics
const TOPIC_IMAGES = [
  '/topic_diamond.png',
  '/topic_hexagon.png',
  '/topic_circles.png',
  '/topic_triangle.png',
  '/topic_star.png',
  '/topic_cube.png'
];

// Function to get a random topic image
const getRandomTopicImage = () => TOPIC_IMAGES[Math.floor(Math.random() * TOPIC_IMAGES.length)];

// Mock data for initial display (will be replaced by Supabase data when connected)
const MOCK_TOPICS: Topic[] = [
  {
    id: '1',
    title: 'Will school close tomorrow due to snow?',
    description: 'Heavy snow is forecasted tonight. Will WCHS close?',
    category: Category.HOT,
    participants: 120,
    endTime: new Date(Date.now() + 86400000).toISOString(),
    poolSize: 5000,
    image: '/topic_diamond.png',
    status: 'active',
    odds: 1.8,
    createdBy: 'admin'
  },
  {
    id: '2',
    title: 'Varsity Basketball vs. Wootton',
    description: 'Predict the winner of Friday night game.',
    category: Category.SPORTS,
    participants: 85,
    endTime: new Date(Date.now() + 259200000).toISOString(),
    poolSize: 3200,
    image: '/topic_hexagon.png',
    status: 'active',
    odds: 1.5,
    createdBy: 'admin'
  }
];

const MOCK_REWARDS: Reward[] = [
  {
    id: 'r1',
    name: 'Starbucks $5 Gift Card',
    cost: 2000,
    image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80',
    description: 'Redeem for a $5 Starbucks Gift Card. Valid at all locations.',
    remaining: 20
  },
  {
    id: 'r2',
    name: 'Starbucks $10 Gift Card',
    cost: 3500,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    description: 'Redeem for a $10 Starbucks Gift Card.',
    remaining: 10
  }
];

interface AppContextType {
  user: User | null;
  topics: Topic[];
  predictions: Prediction[];
  transactions: Transaction[];
  rewards: Reward[];
  redemptions: Redemption[];
  notifications: Array<{ id: string, message: string, type: 'success' | 'error' }>;
  addTopic: (topic: Topic) => void;
  createTopic: (data: { title: string; description: string; category: Category; endTime: string }) => Promise<void>;
  makePrediction: (topicId: string, value: string, wager: number) => Promise<boolean>;
  redeemReward: (rewardId: string) => void;
  login: (email: string) => void;
  logout: () => void;
  dismissNotification: (id: string) => void;
  refreshData: () => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [topics, setTopics] = useState<Topic[]>(MOCK_TOPICS);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rewards, setRewards] = useState<Reward[]>(MOCK_REWARDS);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [notifications, setNotifications] = useState<Array<{ id: string, message: string, type: 'success' | 'error' }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const addNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Try to get profile, but don't fail if it doesn't exist
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const { data: points } = await supabase
          .from('user_points')
          .select('current_points')
          .eq('user_id', session.user.id)
          .single();

        // Always set user when session exists - use profile data if available, otherwise use session data
        setUser({
          id: session.user.id,
          name: profile?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Anonymous',
          email: session.user.email || '',
          avatar: profile?.avatar_url || session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
          points: points?.current_points || 500,
          rank: 'Novice',
          joinedAt: profile?.created_at || new Date().toISOString()
        });
      } else {
        setUser(null);
      }

      // Try to fetch topics from Supabase, fallback to mock
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('*')
        .order('created_at', { ascending: false });

      if (topicsData && topicsData.length > 0) {
        const formattedTopics: Topic[] = topicsData.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          category: t.category as Category,
          participants: t.participant_count || 0,
          endTime: t.end_time,
          poolSize: t.pool_size || 0,
          image: t.image_url || getRandomTopicImage(),
          status: t.status,
          odds: 1.5,
          createdBy: t.created_by
        }));
        setTopics(formattedTopics);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      refreshData();
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = (email: string) => {
    // This is for mock login - real login goes through supabase.auth
    setUser({
      id: 'mock-user',
      name: email.split('@')[0],
      email: email,
      points: 500,
      rank: 'Novice',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      joinedAt: new Date().toISOString()
    });
    addNotification(`Welcome, ${email.split('@')[0]}!`);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPredictions([]);
    setTransactions([]);
    addNotification('Logged out successfully');
  };

  const addTopic = (topic: Topic) => {
    setTopics(prev => [topic, ...prev]);
    addNotification('Topic created successfully!');
  };

  const createTopic = async (data: { title: string; description: string; category: Category; endTime: string }) => {
    if (!user) {
      addNotification('Please login to create a topic', 'error');
      return;
    }

    try {
      const { data: newTopic, error } = await supabase
        .from('topics')
        .insert({
          title: data.title,
          description: data.description,
          category: data.category,
          end_time: data.endTime,
          created_by: user.id,
          status: 'active',
          pool_size: 0,
          participant_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      if (newTopic) {
        const formattedTopic: Topic = {
          id: newTopic.id,
          title: newTopic.title,
          description: newTopic.description,
          category: newTopic.category as Category,
          participants: 0,
          endTime: newTopic.end_time,
          poolSize: 0,
          image: getRandomTopicImage(),
          status: 'active',
          odds: 1.5,
          createdBy: user.id
        };
        setTopics(prev => [formattedTopic, ...prev]);
      }

      addNotification('Topic created successfully!');
    } catch (error) {
      console.error('Failed to create topic:', error);
      addNotification('Failed to create topic. Please try again.', 'error');
    }
  };

  const makePrediction = async (topicId: string, value: string, wager: number): Promise<boolean> => {
    if (!user) return false;
    if (user.points < wager) {
      addNotification('Insufficient points!', 'error');
      return false;
    }

    try {
      // Try Supabase first
      const { error } = await supabase
        .from('predictions')
        .insert({
          user_id: user.id,
          topic_id: topicId,
          prediction_value: value,
          wager: wager
        });

      if (error) throw error;

      // Update local state
      setUser({ ...user, points: user.points - wager });

      const newPrediction: Prediction = {
        id: Math.random().toString(36),
        userId: user.id,
        topicId,
        predictionValue: value,
        wager,
        potentialWin: Math.floor(wager * 1.5),
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      setPredictions(prev => [newPrediction, ...prev]);

      const newTx: Transaction = {
        id: Math.random().toString(36),
        userId: user.id,
        type: 'prediction',
        amount: -wager,
        description: `Prediction on topic`,
        createdAt: new Date().toISOString()
      };
      setTransactions(prev => [newTx, ...prev]);

      setTopics(prev => prev.map(t =>
        t.id === topicId ? { ...t, participants: t.participants + 1, poolSize: t.poolSize + wager } : t
      ));

      addNotification(`Prediction placed! Potential win: ${newPrediction.potentialWin} PTS`);
      return true;
    } catch (e) {
      console.error("Prediction failed:", e);

      // Fallback to local only
      setUser({ ...user, points: user.points - wager });

      const newPrediction: Prediction = {
        id: Math.random().toString(36),
        userId: user.id,
        topicId,
        predictionValue: value,
        wager,
        potentialWin: Math.floor(wager * 1.5),
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      setPredictions(prev => [newPrediction, ...prev]);

      addNotification(`Prediction placed! Potential win: ${newPrediction.potentialWin} PTS`);
      return true;
    }
  };

  const redeemReward = (rewardId: string) => {
    if (!user) return;
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;

    if (user.points < reward.cost) {
      addNotification('Insufficient points for this reward.', 'error');
      return;
    }

    setUser({ ...user, points: user.points - reward.cost });

    const newTx: Transaction = {
      id: Math.random().toString(36),
      userId: user.id,
      type: 'redeem',
      amount: -reward.cost,
      description: `Redeemed: ${reward.name}`,
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [newTx, ...prev]);

    const newRedemption: Redemption = {
      id: Math.random().toString(36),
      userId: user.id,
      rewardId: reward.id,
      code: null,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setRedemptions(prev => [newRedemption, ...prev]);

    addNotification(`Redeemed ${reward.name}! Check your email.`);
  };

  return (
    <AppContext.Provider value={{
      user,
      topics,
      predictions,
      transactions,
      rewards,
      redemptions,
      notifications,
      addTopic,
      createTopic,
      makePrediction,
      redeemReward,
      login,
      logout,
      dismissNotification,
      refreshData,
      isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};