import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MealPlan } from '@/types';

interface MealPlanState {
  activePlan: MealPlan | null;
  selectedMeals: Record<string, string | null>;
  setActivePlan: (plan: MealPlan) => void;
  updateMealSlot: (slotId: string, dishId: string | null) => void;
  resetPlan: () => void;
}

export const useMealPlanStore = create<MealPlanState>()(
  persist(
    (set) => ({
      activePlan: null,
      selectedMeals: {},
      setActivePlan: (plan) =>
        set({
          activePlan: plan,
          selectedMeals: plan.schedule.reduce((acc, entry) => {
            entry.meals.forEach((meal, idx) => {
              acc[`${entry.day}-${idx}`] = meal.dishId ?? null;
            });
            return acc;
          }, {} as Record<string, string | null>)
        }),
      updateMealSlot: (slotId, dishId) =>
        set((state) => ({
          selectedMeals: {
            ...state.selectedMeals,
            [slotId]: dishId
          }
        })),
      resetPlan: () => set({ activePlan: null, selectedMeals: {} })
    }),
    {
      name: 'rasaroots-meal-plan'
    }
  )
);
