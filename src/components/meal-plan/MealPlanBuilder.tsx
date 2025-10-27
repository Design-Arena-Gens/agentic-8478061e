"use client";

import { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { motion } from 'framer-motion';
import type { DietaryPreference, Dish } from '@/types';
import { aggregateNutrition, macroDelta, planProgress } from '@/lib/nutrition';
import { useMealPlanStore } from '@/store/useMealPlanStore';
import { useData } from '@/context/DataContext';

const dietaryOptions: { label: string; value: DietaryPreference | 'all' }[] = [
  { label: 'All dishes', value: 'all' },
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Gluten-free', value: 'gluten-free' },
  { label: 'Jain', value: 'jain' },
  { label: 'Non vegetarian', value: 'non-vegetarian' }
];

const MealCard = ({ dish }: { dish: Dish }) => (
  <div className="flex cursor-grab flex-col rounded-2xl border border-saffron/20 bg-white/90 p-4 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cardamom">
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-slate-900">{dish.name}</p>
      <span className="rounded-full bg-cardamom/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-cardamom">
        {dish.region}
      </span>
    </div>
    <p className="mt-2 text-xs text-slate-600">{dish.description}</p>
    <dl className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
      <div>
        <dt className="font-semibold text-slate-700">Calories</dt>
        <dd>{dish.macros.calories} kcal</dd>
      </div>
      <div>
        <dt className="font-semibold text-slate-700">Protein</dt>
        <dd>{dish.macros.protein} g</dd>
      </div>
    </dl>
  </div>
);

const DraggableDish = ({ dish }: { dish: Dish }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: dish.id });

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      animate={{ scale: isDragging ? 1.02 : 1 }}
      style={{ transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined }}
    >
      <MealCard dish={dish} />
    </motion.div>
  );
};

const MealSlot = ({
  slotId,
  label,
  dish
}: {
  slotId: string;
  label: string;
  dish: Dish | null;
}) => {
  const { isOver, setNodeRef } = useDroppable({ id: slotId });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[120px] rounded-2xl border-2 border-dashed border-cardamom/40 bg-white/70 p-4 transition focus-within:border-solid focus-within:border-cardamom ${
        isOver ? 'border-solid border-cardamom bg-cardamom/10' : ''
      }`}
      role="group"
      aria-label={`Meal slot ${label}`}
      tabIndex={0}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cardamom">{label}</p>
      {dish ? (
        <div className="mt-2 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">{dish.name}</p>
          <p className="text-xs text-slate-500">{dish.macros.calories} kcal • {dish.macros.protein} g protein</p>
        </div>
      ) : (
        <p className="mt-3 text-xs text-slate-400">Drag a dish here</p>
      )}
    </div>
  );
};

export const MealPlanBuilder = () => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), useSensor(TouchSensor));
  const { dishes, mealPlan, loading, updateMealPlan } = useData();
  const { activePlan, setActivePlan, selectedMeals, updateMealSlot } = useMealPlanStore();
  const [dietary, setDietary] = useState<DietaryPreference | 'all'>('all');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [activeDishId, setActiveDishId] = useState<string | null>(null);

  const allergens = useMemo(() => Array.from(new Set(dishes.flatMap((dish) => dish.allergens))), [dishes]);

  useEffect(() => {
    if (mealPlan) {
      setActivePlan(mealPlan);
    }
  }, [mealPlan, setActivePlan]);

  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      const matchesDietary = dietary === 'all' ? true : dish.dietary.includes(dietary);
      const safeForAllergies = selectedAllergies.every((allergy) => !dish.allergens.includes(allergy));
      return matchesDietary && safeForAllergies;
    });
  }, [dietary, dishes, selectedAllergies]);

  const plannedDishes = useMemo(() => {
    const chosen = Object.entries(selectedMeals)
      .map(([, dishId]) => (dishId ? dishes.find((dish) => dish.id === dishId) : null))
      .filter(Boolean) as Dish[];
    return chosen;
  }, [dishes, selectedMeals]);

  const totals = useMemo(() => aggregateNutrition(plannedDishes), [plannedDishes]);
  const delta = activePlan ? macroDelta(totals, activePlan.macroTargets) : null;
  const completion = activePlan ? planProgress(activePlan, selectedMeals) : 0;

  const onDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveDishId(null);
    if (!over) return;
    updateMealSlot(over.id, active.id);
    if (!activePlan) return;
    const updatedSelections = {
      ...selectedMeals,
      [over.id]: active.id
    };
    const updatedSchedule = activePlan.schedule.map((entry) => ({
      ...entry,
      meals: entry.meals.map((meal, slotIndex) => ({
        ...meal,
        dishId: updatedSelections[`${entry.day}-${slotIndex}`] ?? meal.dishId ?? null
      }))
    }));
    void updateMealPlan({ schedule: updatedSchedule });
  };

  const onDragStart = (event: any) => {
    setActiveDishId(event.active.id);
  };

  const activeDish = activeDishId ? dishes.find((dish) => dish.id === activeDishId) ?? null : null;

  if (loading || !dishes.length || !activePlan) {
    return (
      <section id="meal-planner" className="mt-16 rounded-3xl bg-white/80 p-8 shadow-lg shadow-saffron/20">
        <p className="text-sm text-slate-500">Loading personalised planner...</p>
      </section>
    );
  }

  return (
    <section id="meal-planner" className="mt-16 rounded-3xl bg-white/80 p-8 shadow-lg shadow-saffron/20">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cardamom">Personalised plans</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
            Build your weekly canteen ritual
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Completion</span>
          <div className="relative h-3 w-40 rounded-full bg-slate-200">
            <div className="absolute inset-y-0 left-0 rounded-full bg-cardamom" style={{ width: `${completion}%` }}>
              <span className="sr-only">Meal plan completion {completion}%</span>
            </div>
          </div>
          <span className="text-sm font-semibold text-cardamom">{completion}%</span>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-jasmine p-4 text-sm text-slate-600">
            <fieldset className="flex flex-wrap items-center gap-2">
              <legend className="text-xs font-semibold uppercase tracking-[0.3em] text-cardamom">Dietary</legend>
              {dietaryOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDietary(option.value)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                    dietary === option.value
                      ? 'border-cardamom bg-cardamom text-white'
                      : 'border-saffron/30 bg-white text-slate-600 hover:border-cardamom/60'
                  }`}
                  aria-pressed={dietary === option.value}
                >
                  {option.label}
                </button>
              ))}
            </fieldset>

            <fieldset className="flex flex-wrap items-center gap-2">
              <legend className="text-xs font-semibold uppercase tracking-[0.3em] text-cardamom">Allergies</legend>
              {allergens.map((allergy) => {
                const active = selectedAllergies.includes(allergy);
                return (
                  <button
                    key={allergy}
                    type="button"
                    onClick={() =>
                      setSelectedAllergies((prev) =>
                        prev.includes(allergy) ? prev.filter((item) => item !== allergy) : [...prev, allergy]
                      )
                    }
                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                      active
                        ? 'border-saffron bg-saffron text-white'
                        : 'border-saffron/30 bg-white text-slate-600 hover:border-saffron/70'
                    }`}
                    aria-pressed={active}
                  >
                    {allergy}
                  </button>
                );
              })}
            </fieldset>
          </div>

          <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} modifiers={[restrictToWindowEdges]}>
            <div className="grid gap-4 md:grid-cols-2">
              {filteredDishes.map((dish) => (
                <DraggableDish key={dish.id} dish={dish} />
              ))}
            </div>

            <DragOverlay>{activeDish ? <MealCard dish={activeDish} /> : null}</DragOverlay>
          </DndContext>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-cardamom/30 bg-white/90 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{activePlan.name}</h3>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Macro dashboard</p>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-600">
              {([
                ['Calories', totals.calories, activePlan.macroTargets.calories, 'kcal'],
                ['Protein', totals.protein, activePlan.macroTargets.protein, 'g'],
                ['Carbs', totals.carbs, activePlan.macroTargets.carbs, 'g'],
                ['Fats', totals.fats, activePlan.macroTargets.fats, 'g']
              ] as const).map(([label, value, target, unit]) => (
                <div key={label} className="rounded-xl bg-jasmine p-3">
                  <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-cardamom">{label}</dt>
                  <dd className="mt-1 text-lg font-semibold text-slate-900">
                    {Math.round(value)} <span className="text-xs font-medium text-slate-500">{unit}</span>
                  </dd>
                  <p className="text-[11px] text-slate-500">Target {target}{unit}</p>
                </div>
              ))}
            </dl>

            {delta && (
              <div className="mt-4 rounded-xl bg-cardamom/10 p-3 text-xs text-cardamom">
                {Object.entries(delta).map(([key, diff]) => (
                  <p key={key}>
                    {key}: {diff > 0 ? '+' : ''}
                    {Math.round(diff)}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {activePlan?.schedule.map((entry, dayIndex) => (
              <div key={entry.day} className="rounded-2xl border border-saffron/20 bg-white/90 p-5 shadow-sm">
                <header className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-slate-900">{entry.day}</h4>
                  <span className="text-xs uppercase tracking-[0.3em] text-cardamom">{entry.meals.length} meals</span>
                </header>
                <div className="mt-4 grid gap-3">
                  {entry.meals.map((meal, slotIndex) => {
                    const slotId = `${entry.day}-${slotIndex}`;
                    const activeDishId = selectedMeals[slotId] ?? meal.dishId;
                    return (
                      <MealSlot
                        key={slotId}
                        slotId={slotId}
                        label={meal.slot}
                        dish={activeDishId ? dishes.find((dish) => dish.id === activeDishId) ?? null : null}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
