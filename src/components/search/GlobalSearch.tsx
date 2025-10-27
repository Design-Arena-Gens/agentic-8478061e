"use client";

import { useMemo, useState } from 'react';
import { Combobox } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useData } from '@/context/DataContext';
import { getSearchSuggestions } from '@/lib/search';
import type { DietaryPreference } from '@/types';

interface GlobalSearchProps {
  dietaryFilter?: DietaryPreference;
}

export const GlobalSearch = ({ dietaryFilter }: GlobalSearchProps) => {
  const { dishes } = useData();
  const [query, setQuery] = useState('');
  const suggestions = useMemo(() => getSearchSuggestions(dishes, query, dietaryFilter), [dishes, query, dietaryFilter]);

  return (
    <div className="relative mx-auto mt-10 max-w-4xl" aria-label="Dish search">
      <Combobox>
        <div className="relative w-full">
          <Combobox.Input
            placeholder="Search 300+ dishes, ingredients, or regions"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-full border border-saffron/40 bg-white/90 py-4 pl-14 pr-5 text-base text-slate-800 shadow-lg shadow-saffron/10 placeholder:text-slate-400 focus:border-saffron focus:outline-none focus-visible:ring-2 focus-visible:ring-cardamom"
            aria-label="Search for dishes"
          />
          <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-saffron size-6" aria-hidden />
        </div>
        {query && suggestions.length > 0 && (
          <Combobox.Options className="absolute z-20 mt-3 max-h-72 w-full overflow-y-auto rounded-2xl border border-white/70 bg-white/95 py-3 text-sm shadow-2xl focus:outline-none">
            {suggestions.map((suggestion) => (
              <Combobox.Option
                key={suggestion.id}
                value={suggestion}
                className={({ active }) => `flex cursor-pointer items-start justify-between px-4 py-3 ${active ? 'bg-saffron/10 text-saffron' : 'text-slate-700'}`}
              >
                <div>
                  <p className="font-semibold">{suggestion.label}</p>
                  {suggestion.region && <p className="text-xs text-slate-500">{suggestion.region}</p>}
                </div>
                <span className="rounded-full bg-jasmine px-2 py-1 text-xs font-semibold uppercase tracking-widest text-cardamom">{suggestion.type}</span>
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
        {query && suggestions.length === 0 && (
          <div className="absolute z-20 mt-3 w-full rounded-2xl border border-white/70 bg-white/95 px-4 py-3 text-sm text-slate-500 shadow-2xl">
            No matches found. Try searching for a region or ingredient.
          </div>
        )}
      </Combobox>
    </div>
  );
};
