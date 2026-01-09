import React, { createContext, useContext, useState, useEffect } from 'react';
import { Topic, User, Prediction, Reward, Transaction } from './types'; // Removed 'Category'
import { supabase } from './services/supabase';

interface AppContextType {
  user: User | null;
  topics: Topic[];
  predictions: Prediction[];
  addTopic: (topic: Topic) => Promise<void>;
  makePrediction: (topicId: string, value: string, wager: number) => Promise<boolean>;
  refreshData: () => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch User Session & Profile
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
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

        if (profile) {
          setUser({
            id: profile.id,
            name: profile.name || 'Anonymous',
            email: session.user.email || '',
            avatar: profile.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
            points: points?.current_points || 0,
            rank: 'Novice', // Calculate rank later
            joinedAt: profile.created_at
          });
        }
      } else {
        setUser(null);
      }

      // 2. Fetch Topics
      const { data: topicsData } = await supabase
        .from('topics')
        .select('*')
        .order('created_at', { ascending: false });

      if (topicsData) {
        // Map DB fields to FE types if necessary (snake_case to camelCase)
        const formattedTopics: Topic[] = topicsData.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          category: t.category, // Ensure Enum matches or cast
          participants: t.participant_count,
          endTime: t.end_time,
          poolSize: t.pool_size,
          image: t.image_url || 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80',
          status: t.status,
          odds: 1.5, // Placeholder or calc
          createdBy: t.created_by
        }));
        setTopics(formattedTopics);
      }

      // 3. Fetch User Predictions
      if (session?.user) {
        const { data: predData } = await supabase
          .from('predictions')
          .select('*')
          .eq('user_id', session.user.id);

        if (predData) {
          const formattedPreds: Prediction[] = predData.map((p: any) => ({
            id: p.id,
            userId: p.user_id,
            topicId: p.topic_id,
            predictionValue: p.prediction_value,
            wager: p.wager,
            potentialWin: 0, // Calc
            status: p.is_correct === true ? 'won' : p.is_correct === false ? 'lost' : 'pending',
            createdAt: p.created_at
          }));
          setPredictions(formattedPreds);
        }
      } else {
        setPredictions([]);
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

  const addTopic = async (topic: Topic) => {
    console.log("Add topic not implemented yet");
  };

  const makePrediction = async (topicId: string, value: string, wager: number): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('predictions')
        .insert({
          user_id: user.id,
          topic_id: topicId,
          prediction_value: value,
          wager: wager
        });

      if (error) throw error;

      await refreshData();
      return true;
    } catch (e) {
      console.error("Prediction failed:", e);
      return false;
    }
  };

  return (
    <AppContext.Provider value={{ user, topics, predictions, addTopic, makePrediction, refreshData, isLoading }}>
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