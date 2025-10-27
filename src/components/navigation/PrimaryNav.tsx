"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaApple, FaFacebook } from 'react-icons/fa';

const navItems = [
  { href: '#meal-planner', label: 'Meal Planner' },
  { href: '#regional-cuisine', label: 'Regional Stories' },
  { href: '#seasonal-menu', label: 'Seasonal Menu' },
  { href: '#loyalty-program', label: 'Loyalty' },
  { href: '#feedback', label: 'Community' }
];

export const PrimaryNav = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-jasmine/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:px-6 sm:py-4 lg:px-8">
        <Link href="#" className="flex items-center gap-2" aria-label="RasaRoots homepage">
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-saffron font-semibold text-white shadow-glow">
            RR
          </span>
          <div className="flex flex-col">
            <span className="font-display text-xl font-semibold tracking-wide text-saffron">RasaRoots</span>
            <span className="text-xs uppercase tracking-[0.3em] text-slate-600">Smart Canteen</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition hover:text-saffron focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cardamom"
              aria-label={`Jump to ${item.label}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            className="rounded-full border border-saffron px-4 py-2 text-sm font-medium text-saffron transition hover:bg-saffron hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cardamom"
            aria-label="Log in"
          >
            Log In
          </button>
          <button
            type="button"
            className="rounded-full bg-saffron px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-saffron/30 transition hover:bg-cardamom focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cardamom"
            aria-label="Create account"
          >
            Join RasaRoots
          </button>
        </div>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 lg:hidden"
          onClick={toggleMenu}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label="Toggle navigation menu"
        >
          {open ? <XMarkIcon className="size-6" /> : <Bars3Icon className="size-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden"
          >
            <ul className="space-y-4 px-6 pb-6 pt-4 text-sm font-medium text-slate-700">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="block rounded-lg bg-white/70 px-4 py-3 shadow-sm transition hover:bg-saffron/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cardamom"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <p className="text-xs uppercase tracking-wide text-slate-500">Social sign-in</p>
                <div className="mt-3 flex items-center gap-3">
                  {[{ icon: FaGoogle, label: 'Google' }, { icon: FaApple, label: 'Apple' }, { icon: FaFacebook, label: 'Facebook' }].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      type="button"
                      className="flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-saffron/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cardamom"
                      aria-label={`Continue with ${label}`}
                    >
                      <Icon className="size-5" aria-hidden />
                    </button>
                  ))}
                </div>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
