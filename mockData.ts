import { Category, Topic, User, Reward, Transaction } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Chen',
  email: 'alex.c@wchs.edu',
  points: 580, 
  rank: 'Forecaster Lvl 1',
  avatar: 'https://picsum.photos/200/200',
  joinedAt: new Date().toISOString()
};

export const TOPICS: Topic[] = [
  {
    id: 't1',
    title: 'The Great Snowstorm',
    description: 'Will WCHS declare a snow day for tomorrow (Friday)? Based on current NOAA patterns.',
    category: Category.HOT,
    participants: 1240,
    endTime: new Date(Date.now() + 86400000).toISOString(),
    poolSize: 45000,
    image: 'https://picsum.photos/800/600?grayscale',
    status: 'active',
    odds: 2.1,
    createdBy: 'admin'
  },
  {
    id: 't2',
    title: 'Bulldogs vs. Titans',
    description: 'Varsity Basketball: Will the Bulldogs win by more than 10 points tonight?',
    category: Category.SPORTS,
    participants: 856,
    endTime: new Date(Date.now() + 12000000).toISOString(),
    poolSize: 28000,
    image: 'https://picsum.photos/800/601?grayscale',
    status: 'active',
    odds: 1.8,
    createdBy: 'admin'
  },
  {
    id: 't3',
    title: 'Spicy Chicken Shortage',
    description: 'Will the cafeteria run out of Spicy Chicken Sandwiches before 12:30 PM?',
    category: Category.CAMPUS,
    participants: 342,
    endTime: new Date(Date.now() + 40000000).toISOString(),
    poolSize: 12000,
    image: 'https://picsum.photos/800/602?grayscale',
    status: 'active',
    odds: 3.5,
    createdBy: 'u2'
  },
  {
    id: 't4',
    title: 'Spring Musical Lead',
    description: 'Who will be cast as the lead in the upcoming Spring production?',
    category: Category.CUSTOM,
    participants: 512,
    endTime: new Date(Date.now() + 600000000).toISOString(),
    poolSize: 15500,
    image: 'https://picsum.photos/800/603?grayscale',
    status: 'active',
    odds: 4.0,
    createdBy: 'u3'
  }
];

export const REWARDS: Reward[] = [
  {
    id: 'r1',
    name: 'Starbucks $5 Card',
    cost: 1000,
    description: 'Digital gift card sent to your email.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop',
    remaining: 50
  },
  {
    id: 'r2',
    name: 'Starbucks $10 Card',
    cost: 1800,
    description: 'Double the caffeine. Best value.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop',
    remaining: 20
  },
  {
    id: 'r3',
    name: 'Bulldog Hoodie',
    cost: 5000,
    description: 'Limited edition WCHS Prediction Club hoodie.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop',
    remaining: 5
  }
];

export const TRANSACTIONS: Transaction[] = [
  {
    id: 'tx1',
    userId: 'u1',
    type: 'initial',
    amount: 500,
    description: 'Welcome Bonus',
    createdAt: new Date(Date.now() - 100000000).toISOString()
  },
  {
    id: 'tx2',
    userId: 'u1',
    type: 'prediction',
    amount: -100,
    description: 'Wager: Snow Day',
    createdAt: new Date(Date.now() - 50000000).toISOString()
  },
  {
    id: 'tx3',
    userId: 'u1',
    type: 'win',
    amount: 180,
    description: 'Win: Snow Day',
    createdAt: new Date(Date.now() - 10000000).toISOString()
  }
];