"use client";

import { useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { regionDetails } from '@/data/regions';
import { useData } from '@/context/DataContext';

const geoUrl =
  'https://raw.githubusercontent.com/iamspruce/intro-to-d3/main/data/india_states_topo.json';

export const RegionalShowcase = () => {
  const [activeRegion, setActiveRegion] = useState(regionDetails[0]);
  const { dishes } = useData();

  const popularDishes = useMemo(
    () => dishes.filter((dish) => dish.region === activeRegion.id).slice(0, 3),
    [activeRegion.id, dishes]
  );

  return (
    <section id="regional-cuisine" className="mt-16 rounded-3xl bg-white/80 p-8 shadow-lg shadow-cardamom/10">
      <header className="flex flex-col gap-2 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cardamom">Regional Atlas</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
            Trace flavours across India’s culinary map
          </h2>
        </div>
        <p className="max-w-xl text-sm text-slate-500">
          Hover over the map to reveal cultural footnotes, signature ingredients, and state-wise specialties.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl bg-jasmine p-4 shadow-inner">
          <ComposableMap projection="geoMercator" projectionConfig={{ scale: 900, center: [78.9629, 22.5937] }} aria-label="Interactive map of India">
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const regionMatch = regionDetails.find((region) =>
                    geo.properties.st_nm && region.states.some((state) => geo.properties.st_nm.includes(state.name))
                  );
                  const isActive = regionMatch?.id === activeRegion.id;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        if (regionMatch) {
                          setActiveRegion(regionMatch);
                        }
                      }}
                      onFocus={() => {
                        if (regionMatch) {
                          setActiveRegion(regionMatch);
                        }
                      }}
                      tabIndex={0}
                      style={{
                        default: {
                          fill: isActive ? '#FF7F50' : '#E2E8F0',
                          outline: 'none'
                        },
                        hover: {
                          fill: '#FFD700',
                          outline: 'none'
                        },
                        pressed: {
                          fill: '#3CB371',
                          outline: 'none'
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-cardamom/30 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{activeRegion.id} India</h3>
            <p className="mt-2 text-sm text-slate-600">{activeRegion.description}</p>
            <dl className="mt-4 space-y-3 text-sm text-slate-600">
              <div>
                <dt className="font-semibold text-slate-800">Featured ingredients</dt>
                <dd>{activeRegion.featuredIngredients.join(' • ')}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-800">Culinary spotlight</dt>
                <dd>{activeRegion.spotlight}</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-4 text-sm text-slate-600">
            {activeRegion.states.map((state) => (
              <article key={state.name} className="rounded-2xl border border-saffron/30 bg-gradient-to-r from-white to-jasmine px-5 py-4 shadow-sm">
                <header className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-slate-800">{state.name}</h4>
                  <span className="rounded-full bg-saffron/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-saffron">
                    Story
                  </span>
                </header>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-cardamom">Specialties</p>
                <p>{state.specialties.join(', ')}</p>
                <p className="mt-2 text-sm text-slate-500">{state.story}</p>
              </article>
            ))}
          </div>

          <div className="rounded-2xl border border-cardamom/20 bg-white/80 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-cardamom">Taste the region</p>
            <ul className="mt-3 space-y-3 text-sm text-slate-700">
              {popularDishes.map((dish) => (
                <li key={dish.id} className="flex items-center justify-between">
                  <span className="font-medium">{dish.name}</span>
                  <span className="rounded-full bg-cardamom/10 px-3 py-1 text-xs font-semibold text-cardamom">
                    {dish.dietary.join(', ')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
