"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type {
  Dish,
  MealPlan,
  Review,
  SeasonalDish,
  LoyaltyProfile,
  LoyaltyTier,
  IngredientOption
} from '@/types';

interface DataContextValue {
  dishes: Dish[];
  seasonal: SeasonalDish[];
  mealPlan: MealPlan | null;
  reviews: Review[];
  loyalty: { profile: LoyaltyProfile | null; tiers: LoyaltyTier[] };
  ingredients: IngredientOption[];
  loading: boolean;
  submitReview: (review: Review) => Promise<void>;
  updateMealPlan: (plan: Partial<MealPlan>) => Promise<void>;
  refreshReviews: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [seasonal, setSeasonal] = useState<SeasonalDish[]>([]);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loyalty, setLoyalty] = useState<{ profile: LoyaltyProfile | null; tiers: LoyaltyTier[] }>({
    profile: null,
    tiers: []
  });
  const [ingredients, setIngredients] = useState<IngredientOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [dishesRes, seasonalRes, mealPlanRes, reviewsRes, loyaltyRes, ingredientsRes] = await Promise.all([
          fetch('/api/dishes').then((res) => res.json()),
          fetch('/api/seasonal').then((res) => res.json()),
          fetch('/api/meal-plans').then((res) => res.json()),
          fetch('/api/reviews').then((res) => res.json()),
          fetch('/api/loyalty').then((res) => res.json()),
          fetch('/api/ingredients').then((res) => res.json())
        ]);
        setDishes(dishesRes.dishes);
        setSeasonal(seasonalRes.seasonal);
        setMealPlan(mealPlanRes.plan);
        setReviews(reviewsRes.reviews);
        setLoyalty({ profile: loyaltyRes.profile, tiers: loyaltyRes.tiers });
        setIngredients(ingredientsRes.ingredients);
      } catch (error) {
        console.error('Failed to bootstrap data', error);
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, []);

  const submitReview = useCallback(async (review: Review) => {
    setReviews((prev) => [review, ...prev]);
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
  }, []);

  const refreshReviews = useCallback(async () => {
    const response = await fetch('/api/reviews').then((res) => res.json());
    setReviews(response.reviews);
  }, []);

  const updateMealPlan = useCallback(async (plan: Partial<MealPlan>) => {
    const updated = await fetch('/api/meal-plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan)
    }).then((res) => res.json());
    setMealPlan(updated.plan);
  }, []);

  const value = useMemo(
    () => ({
      dishes,
      seasonal,
      mealPlan,
      reviews,
      loyalty,
      loading,
      ingredients,
      submitReview,
      updateMealPlan,
      refreshReviews
    }),
    [dishes, seasonal, mealPlan, reviews, loyalty, loading, ingredients, submitReview, updateMealPlan, refreshReviews]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
