"use client";

import { useMemo, useState } from 'react';
import type { IngredientOption } from '@/types';
import { useData } from '@/context/DataContext';

interface CustomRecipe {
  id: string;
  name: string;
  ingredients: IngredientOption[];
}

export const CustomizationStudio = () => {
  const { ingredients: ingredientOptions, dishes } = useData();
  const [selectedIngredients, setSelectedIngredients] = useState<IngredientOption[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<CustomRecipe[]>([]);
  const [recipeName, setRecipeName] = useState('');

  const nutritionSummary = useMemo(
    () =>
      selectedIngredients.reduce(
        (acc, ingredient) => {
          acc.calories += ingredient.nutrition.calories;
          acc.protein += ingredient.nutrition.protein;
          acc.carbs += ingredient.nutrition.carbs;
          acc.fats += ingredient.nutrition.fats;
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fats: 0 }
      ),
    [selectedIngredients]
  );

  const recommendations = useMemo(() => {
    const pairs = dishes.filter((dish) =>
      selectedIngredients.every((ingredient) =>
        ingredient.pairings.some((pair) => dish.description.toLowerCase().includes(pair.toLowerCase()))
      )
    );
    return pairs.slice(0, 3);
  }, [dishes, selectedIngredients]);

  const addIngredient = (ingredient: IngredientOption) => {
    setSelectedIngredients((prev) => (prev.find((item) => item.id === ingredient.id) ? prev : [...prev, ingredient]));
  };

  const removeIngredient = (id: string) => {
    setSelectedIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id));
  };

  const handleSave = () => {
    if (!selectedIngredients.length || !recipeName.trim()) return;
    setSavedRecipes((prev) => [
      {
        id: `recipe-${Date.now()}`,
        name: recipeName,
        ingredients: selectedIngredients
      },
      ...prev
    ]);
    setRecipeName('');
  };

  return (
    <section className="mt-16 rounded-3xl bg-white/90 p-8 shadow-lg shadow-saffron/20" aria-label="Meal customization studio">
      <header className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cardamom">Ingredient studio</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
            Craft recipes around regional availability & nutrition
          </h2>
        </div>
        <p className="max-w-xl text-sm text-slate-500">
          Pick seasonal ingredients to unlock chef suggestions and macro-friendly pairings customised for your preferences.
        </p>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {ingredientOptions.map((ingredient) => {
              const active = selectedIngredients.some((item) => item.id === ingredient.id);
              return (
                <button
                  key={ingredient.id}
                  type="button"
                  onClick={() => (active ? removeIngredient(ingredient.id) : addIngredient(ingredient))}
                  className={`rounded-2xl border p-4 text-left text-sm shadow-sm transition ${
                    active
                      ? 'border-cardamom bg-cardamom/10 text-cardamom'
                      : 'border-saffron/20 bg-white/90 text-slate-700 hover:border-cardamom'
                  }`}
                  aria-pressed={active}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{ingredient.name}</h3>
                    <span className="rounded-full bg-jasmine px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                      {ingredient.regionAvailability.join(' • ')}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Supports: {ingredient.supportsDietary.join(', ')}</p>
                  <p className="mt-1 text-xs text-slate-400">Pairs with: {ingredient.pairings.join(', ')}</p>
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-cardamom/20 bg-white/90 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-cardamom">Recipe notebook</p>
            <div className="mt-3 flex items-center gap-3">
              <input
                value={recipeName}
                onChange={(event) => setRecipeName(event.target.value)}
                type="text"
                placeholder="Give your creation a name"
                className="flex-1 rounded-full border border-saffron/20 bg-white/90 px-4 py-3 text-sm text-slate-700 focus:border-cardamom focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cardamom"
              />
              <button
                type="button"
                onClick={handleSave}
                className="rounded-full bg-cardamom px-5 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-saffron focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
              >
                Save recipe
              </button>
            </div>
            {savedRecipes.length > 0 && (
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {savedRecipes.map((recipe) => (
                  <li key={recipe.id} className="rounded-2xl border border-saffron/20 bg-jasmine/80 px-4 py-3">
                    <p className="font-semibold text-slate-900">{recipe.name}</p>
                    <p className="text-xs text-slate-500">
                      {recipe.ingredients.map((ingredient) => ingredient.name).join(', ')}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-saffron/20 bg-white/90 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Nutrition spotlight</h3>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-cardamom">Calories</dt>
                <dd className="mt-1 text-xl font-semibold text-slate-900">{Math.round(nutritionSummary.calories)} kcal</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-cardamom">Protein</dt>
                <dd className="mt-1 text-xl font-semibold text-slate-900">{Math.round(nutritionSummary.protein)} g</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-cardamom">Carbs</dt>
                <dd className="mt-1 text-xl font-semibold text-slate-900">{Math.round(nutritionSummary.carbs)} g</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-cardamom">Fats</dt>
                <dd className="mt-1 text-xl font-semibold text-slate-900">{Math.round(nutritionSummary.fats)} g</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-slate-500">
              Macro values update dynamically as you add or remove ingredients.
            </p>
          </div>

          <div className="rounded-2xl border border-cardamom/20 bg-gradient-to-br from-cardamom/10 via-white to-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Chef suggestions</h3>
            {selectedIngredients.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">Pick a few ingredients to see regional dish inspirations.</p>
            ) : (
              <ul className="mt-3 space-y-3 text-sm text-slate-600">
                {recommendations.length > 0 ? (
                  recommendations.map((dish) => (
                    <li key={dish.id} className="rounded-2xl border border-saffron/20 bg-white/90 px-4 py-3">
                      <p className="font-semibold text-slate-900">{dish.name}</p>
                      <p className="text-xs text-slate-500">{dish.region} • {dish.state}</p>
                      <p className="mt-1 text-xs text-slate-400">{dish.description}</p>
                    </li>
                  ))
                ) : (
                  <li className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-xs text-slate-500">
                    No direct matches just yet. Try pairing with coconut, millet, or mustard for curated suggestions.
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
