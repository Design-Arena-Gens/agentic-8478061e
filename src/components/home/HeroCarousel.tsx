"use client";

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/context/DataContext';

export const HeroCarousel = () => {
  const { dishes } = useData();
  const featured = useMemo(
    () => dishes.filter((dish) => ['dish-rogan-josh', 'dish-appam-stew', 'dish-masala-dosa'].includes(dish.id)),
    [dishes]
  );
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (featured.length === 0) return undefined;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-saffron/40 via-transparent to-cardamom/30 p-1 shadow-glow">
      <div className="glass-panel relative rounded-[1.4rem] p-6 sm:p-10 lg:flex lg:min-h-[420px] lg:items-center lg:gap-10">
        <div className="space-y-6 lg:flex-1">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-saffron">
            Taste • Track • Treasure
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={featured[current].id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl lg:text-5xl">
                {featured[current].name}: {featured[current].state} heritage on your plate
              </h1>
              <p className="max-w-2xl text-base text-slate-700 sm:text-lg">
                {featured[current].description}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="rounded-full bg-saffron/10 px-3 py-1 font-medium text-saffron">{featured[current].region} India</span>
                <span className="rounded-full bg-cardamom/10 px-3 py-1 font-medium text-cardamom">{featured[current].dietary.join(', ')}</span>
                <span className="rounded-full bg-turmeric/20 px-3 py-1 font-medium text-amber-700">Spice Level {featured[current].spiceLevel}/5</span>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex flex-wrap gap-4">
            <button className="rounded-full bg-saffron px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-saffron/30 transition hover:bg-cardamom focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron">
              Explore dish history
            </button>
            <button className="rounded-full border border-saffron px-6 py-3 text-sm font-semibold text-saffron transition hover:bg-saffron/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cardamom">
              Add to meal plan
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:mt-0 lg:flex-1">
          <div className="relative h-64 overflow-hidden rounded-3xl bg-slate-900/10 sm:h-80">
            <AnimatePresence mode="wait">
              <motion.div
                key={featured[current].image}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <Image
                  src={featured[current].image}
                  alt={featured[current].name}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-600 shadow">
            <div>
              <p className="font-semibold text-slate-800">Origin Story</p>
              <p className="text-xs text-slate-500">{featured[current].culturalNotes}</p>
            </div>
            <div className="flex items-center gap-2">
              {featured.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={`size-3 rounded-full transition ${index === current ? 'bg-saffron' : 'bg-slate-300 hover:bg-cardamom/70'}`}
                  onClick={() => setCurrent(index)}
                  aria-label={`Show ${item.name}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
