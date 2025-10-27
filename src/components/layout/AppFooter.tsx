export const AppFooter = () => (
  <footer className="mt-16 rounded-3xl bg-white/90 p-6 text-sm text-slate-500 shadow-inner">
    <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p>
        © {new Date().getFullYear()} RasaRoots Smart Canteen. Crafted with fragrant code and inclusive design.
      </p>
      <nav aria-label="Footer navigation" className="flex gap-4 text-xs uppercase tracking-[0.3em]">
        <a href="#regional-cuisine" className="hover:text-saffron">Regions</a>
        <a href="#meal-planner" className="hover:text-saffron">Meal Plans</a>
        <a href="#loyalty-program" className="hover:text-saffron">Loyalty</a>
        <a href="#feedback" className="hover:text-saffron">Feedback</a>
      </nav>
    </div>
  </footer>
);
