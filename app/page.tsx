import { Suspense } from 'react';
import { PrimaryNav } from '@/components/navigation/PrimaryNav';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { SeasonalHighlights } from '@/components/seasonal/SeasonalHighlights';
import { RegionalShowcase } from '@/components/regions/RegionalShowcase';
import { MealPlanBuilder } from '@/components/meal-plan/MealPlanBuilder';
import { FeedbackPortal } from '@/components/feedback/FeedbackPortal';
import { LoyaltyShowcase } from '@/components/loyalty/LoyaltyShowcase';
import { CustomizationStudio } from '@/components/customization/CustomizationStudio';
import { WearableInsights } from '@/components/wearables/WearableInsights';
import { AppFooter } from '@/components/layout/AppFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-jasmine via-white to-jasmine">
      <PrimaryNav />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <Suspense fallback={<p className="text-sm text-slate-500">Loading experience...</p>}>
          <HeroCarousel />
        </Suspense>
        <GlobalSearch />
        <SeasonalHighlights />
        <RegionalShowcase />
        <MealPlanBuilder />
        <WearableInsights />
        <CustomizationStudio />
        <LoyaltyShowcase />
        <FeedbackPortal />
      </main>
      <AppFooter />
    </div>
  );
}
