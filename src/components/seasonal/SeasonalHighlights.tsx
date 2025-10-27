"use client";

import { useData } from '@/context/DataContext';
import { findDishById } from '@/lib/search';
import { format } from 'date-fns';

export const SeasonalHighlights = () => {
  const { seasonal, dishes } = useData();

  return (
    <section id="seasonal-menu" className="mt-16 rounded-3xl bg-white/80 p-8 shadow-lg shadow-saffron/10">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-saffron">Seasonal menu</p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900 sm:text-3xl">Festive rotations & chef stories</h2>
      </div>
      <p className="text-sm text-slate-500">
        Curated spreads that celebrate regional festivals and seasonal produce.
      </p>
    </div>

    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {seasonal.map((seasonalItem) => {
        const dish = findDishById(dishes, seasonalItem.dishId);
        if (!dish) return null;
        return (
          <article key={seasonalItem.id} className="flex h-full flex-col rounded-2xl border border-saffron/20 bg-gradient-to-br from-jasmine via-white to-white p-6">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cardamom">{seasonalItem.festival}</p>
                <h3 className="mt-1 font-semibold text-slate-900">{seasonalItem.title}</h3>
              </div>
              <span className="rounded-full bg-saffron/10 px-3 py-1 text-xs font-semibold text-saffron">{seasonalItem.highlight}</span>
            </header>
            <p className="mt-3 flex-1 text-sm text-slate-600">{seasonalItem.description}</p>
            <dl className="mt-4 space-y-2 text-sm text-slate-500">
              <div className="flex items-center justify-between">
                <dt className="font-medium text-slate-700">Spotlight Dish</dt>
                <dd>{dish.name}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="font-medium text-slate-700">Available until</dt>
                <dd>{format(new Date(seasonalItem.availableUntil), 'MMM d, yyyy')}</dd>
              </div>
              {seasonalItem.promotion && (
                <div className="flex items-center justify-between text-cardamom">
                  <dt className="font-medium">{seasonalItem.promotion.label}</dt>
                  <dd>-{seasonalItem.promotion.discount}%</dd>
                </div>
              )}
            </dl>
            <footer className="mt-4 flex items-center justify-between border-t border-dashed border-saffron/30 pt-4 text-sm">
              <p className="text-slate-500">Pair it with {dish.micros.vitamins[0]} rich beverages.</p>
              <button className="rounded-full bg-cardamom px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-saffron focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron">
                Reserve
              </button>
            </footer>
          </article>
        );
      })}
    </div>
  </section>
  );
};
