export type DietaryPreference = 'vegetarian' | 'vegan' | 'gluten-free' | 'jain' | 'non-vegetarian';

export type Region = 'North' | 'South' | 'East' | 'West' | 'Central';

export interface Dish {
  id: string;
  name: string;
  description: string;
  image: string;
  region: Region;
  state: string;
  spiceLevel: 1 | 2 | 3 | 4 | 5;
  dietary: DietaryPreference[];
  allergens: string[];
  price: number;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  micros: {
    vitamins: string[];
    minerals: string[];
  };
  culturalNotes: string;
  seasonalTags: string[];
  isChefSpecial?: boolean;
  isDishOfTheDay?: boolean;
}

export interface MealPlanEntry {
  day: string;
  meals: Array<{
    slot: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    dishId: string | null;
  }>;
}

export interface MealPlan {
  id: string;
  name: string;
  dietaryPreference: DietaryPreference;
  allergies: string[];
  schedule: MealPlanEntry[];
  macroTargets: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface SeasonalDish {
  id: string;
  title: string;
  description: string;
  festival: string;
  availableUntil: string;
  highlight: 'Dish of the Day' | 'Chef\'s Special' | 'Festival Feature';
  dishId: string;
  promotion?: {
    label: string;
    discount: number;
  };
}

export interface Review {
  id: string;
  dishId: string;
  rating: number;
  comment: string;
  sentimentScore: number;
  user: {
    name: string;
    avatarColor: string;
    membershipTier: LoyaltyTier['id'];
  };
  createdAt: string;
  photos: string[];
  flagged: boolean;
}

export interface LoyaltyTier {
  id: 'bronze' | 'silver' | 'gold' | 'saffron-elite';
  name: string;
  minPoints: number;
  benefits: string[];
  color: string;
}

export interface LoyaltyProfile {
  userId: string;
  points: number;
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
  streak: number;
  referredFriends: number;
  tierId: LoyaltyTier['id'];
  leaderboardRank: number;
}

export interface IngredientOption {
  id: string;
  name: string;
  regionAvailability: Region[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  supportsDietary: DietaryPreference[];
  allergens: string[];
  pairings: string[];
}

export interface WearableSummary {
  steps: number;
  caloriesBurned: number;
  activeMinutes: number;
  hydrationLevel: number;
}

export interface RealTimeUpdate {
  type: 'order-status' | 'availability' | 'promotion';
  message: string;
  timestamp: string;
  payload?: Record<string, unknown>;
}
