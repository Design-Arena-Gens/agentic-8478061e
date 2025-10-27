"use client";

import { useEffect, useState } from 'react';
import { fetchWearableSummary } from '@/lib/wearables';
import type { WearableSummary } from '@/types';

export const WearableInsights = () => {
  const [summary, setSummary] = useState<WearableSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWearableSummary()
      .then(setSummary)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mt-16 rounded-3xl bg-gradient-to-br from-cardamom/10 via-white to-jasmine p-8 shadow-lg shadow-cardamom/10">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cardamom">Wellness sync</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
            Integrate your wearable for real-time nourishment goals
          </h2>
        </div>
        <p className="max-w-xl text-sm text-slate-500">
          Track how seasonal menus align with your daily activity, hydration, and calorie burn.
        </p>
      </header>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <p className="text-sm text-slate-500">Connecting to wearable services...</p>
        ) : summary ? (
          [
            { label: 'Steps today', value: summary.steps.toLocaleString(), hint: 'Aim for 9,000 steps to unlock move streak badge.' },
            { label: 'Calories burned', value: `${summary.caloriesBurned} kcal`, hint: 'Sync with plan macros for balanced energy.' },
            { label: 'Active minutes', value: `${summary.activeMinutes} mins`, hint: 'Schedule protein-rich meals post activity.' },
            { label: 'Hydration level', value: `${summary.hydrationLevel}%`, hint: 'Stay above 70% for optimal digestion.' }
          ].map((metric) => (
            <article key={metric.label} className="rounded-2xl border border-cardamom/20 bg-white/90 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cardamom">{metric.label}</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{metric.value}</p>
              <p className="mt-2 text-xs text-slate-500">{metric.hint}</p>
            </article>
          ))
        ) : (
          <p className="text-sm text-slate-500">
            Syncing unavailable. Please reconnect your wearable device to view insights.
          </p>
        )}
      </div>
    </section>
  );
};
