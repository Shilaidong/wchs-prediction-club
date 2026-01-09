export enum Category {
  HOT = 'Immediate Heat',
  SPORTS = 'Varsity Glory',
  CAMPUS = 'Campus Life',
  CUSTOM = 'Student Voice'
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  category: Category;
  participants: number;
  endTime: string; // ISO Date
  poolSize: number; // Total points in pool
  image: string;
  status: 'active' | 'closed' | 'settled';
  odds: number; // e.g., 1.5x return
  createdBy: string; // User ID
  userPredictionId?: string; // ID of prediction if current user predicted
}

export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  rank: string;
  avatar: string;
  joinedAt: string;
}

export interface Prediction {
  id: string;
  userId: string;
  topicId: string;
  predictionValue: string; // 'Yes', 'No', 'Bulldogs', etc.
  wager: number;
  potentialWin: number;
  status: 'pending' | 'won' | 'lost';
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'initial' | 'prediction' | 'win' | 'create_reward' | 'redeem';
  amount: number; // Positive or negative
  description: string;
  createdAt: string;
}

export interface Reward {
  id: string;
  name: string;
  cost: number;
  image: string;
  description: string;
  remaining: number;
}

export interface Redemption {
  id: string;
  userId: string;
  rewardId: string;
  code: string | null; // e.g., Gift card code
  status: 'pending' | 'fulfilled';
  createdAt: string;
}