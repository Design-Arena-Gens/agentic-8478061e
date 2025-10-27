"use client";

import { useData } from '@/context/DataContext';

export const LoyaltyShowcase = () => {
  const { loyalty } = useData();
  const tiers = loyalty.tiers;
  const profile = loyalty.profile;

  if (!profile || tiers.length === 0) {
    return (
      <section id="loyalty-program" className="mt-16 rounded-3xl bg-white/90 p-8 shadow-lg shadow-cardamom/15">
        <p className="text-sm text-slate-500">Loading loyalty journeys...</p>
      </section>
    );
  }

  const activeTier = tiers
    .slice()
    .reverse()
    .find((tier) => profile.points >= tier.minPoints) ?? tiers[0];

  const nextTier = tiers.find((tier) => tier.minPoints > activeTier.minPoints);
  const progressToNext = nextTier
    ? Math.min(100, Math.round(((profile.points - activeTier.minPoints) / (nextTier.minPoints - activeTier.minPoints)) * 100))
    : 100;

  return (
    <section id="loyalty-program" className="mt-16 rounded-3xl bg-white/90 p-8 shadow-lg shadow-cardamom/15">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cardamom">Loyalty odyssey</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
            Earn spice points, unlock culinary privileges
          </h2>
        </div>
        <p className="max-w-lg text-sm text-slate-500">
          Gamified challenges reward your adventurous palate with points, badges, and chef-led experiences.
        </p>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-saffron/25 bg-gradient-to-br from-jasmine via-white to-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-saffron">Current tier</p>
              <h3 className="mt-1 text-2xl font-semibold text-slate-900" style={{ color: activeTier.color }}>
                {activeTier.name}
              </h3>
              <p className="mt-1 text-sm text-slate-600">{profile.points} spice points</p>
            </div>
            <div className="rounded-full bg-cardamom/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-cardamom">
              Rank #{profile.leaderboardRank}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              <span>Progress to next tier</span>
              <span>{progressToNext}%</span>
            </div>
            <div className="mt-2 h-3 rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-saffron"
                style={{ width: `${progressToNext}%` }}
                role="progressbar"
                aria-valuenow={progressToNext}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progress to next loyalty tier"
              />
            </div>
            {nextTier ? (
              <p className="mt-2 text-xs text-slate-500">
                Earn {nextTier.minPoints - profile.points} more points to reach {nextTier.name}.
              </p>
            ) : (
              <p className="mt-2 text-xs text-cardamom">You have unlocked all available tiers. Expect concierge surprises!</p>
            )}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {profile.badges.map((badge) => (
              <article key={badge.id} className="rounded-2xl border border-cardamom/20 bg-white/90 px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" role="img" aria-label={badge.name}>
                    {badge.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{badge.name}</p>
                    <p className="text-xs text-slate-500">{badge.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-cardamom/25 bg-white/90 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-cardamom">Tier matrix</p>
            <ul className="mt-4 space-y-4 text-sm text-slate-600">
              {tiers.map((tier) => (
                <li key={tier.id} className="rounded-2xl border border-saffron/20 bg-jasmine/80 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold" style={{ color: tier.color }}>
                      {tier.name}
                    </p>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
                      {tier.minPoints}+ pts
                    </span>
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-500">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-saffron/25 bg-gradient-to-br from-cardamom/10 via-white to-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Weekly quests</h3>
            <ul className="mt-3 space-y-3 text-sm text-slate-600">
              <li className="flex items-center justify-between">
                <span>Try a dish from a new region</span>
                <span className="rounded-full bg-saffron px-3 py-1 text-xs font-semibold text-white">+120 pts</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Share a photo review with sentiment insight</span>
                <span className="rounded-full bg-cardamom px-3 py-1 text-xs font-semibold text-white">+80 pts</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Refer a friend who completes a meal plan</span>
                <span className="rounded-full bg-turmeric px-3 py-1 text-xs font-semibold text-slate-800">+150 pts</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
