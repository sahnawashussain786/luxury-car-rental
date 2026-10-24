'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FleetCard from './FleetCard';
import { api } from '@/app/lib/api';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'supercar', label: 'Supercars' },
  { value: 'hypercar', label: 'Hypercars' },
  { value: 'luxury', label: 'Luxury' },
];

export default function FleetSection() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);

  const loadCars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { cars: loaded } = await api.cars.list({
        available: true,
        category: category === 'all' ? undefined : category,
        query: query.trim() || undefined,
      });
      setCars(loaded ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, query]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const { cars: loaded } = await api.cars.list({
          available: true,
          category: category === 'all' ? undefined : category,
          query: query.trim() || undefined,
        });
        if (!cancelled) {
          setCars(loaded ?? []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setCars([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [category, query]);

  return (
    <section id="fleet" className="border-t border-zinc-100 bg-white py-24 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            The fleet
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Choose your machine
          </h2>
          <p className="mt-3 max-w-xl text-zinc-500">
            Every car in the fleet is available to book today. Filter by category or search by name.
          </p>
        </motion.div>

        <div className="mb-8 flex flex-wrap gap-3">
          {CATEGORIES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setCategory(value)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                category === value
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative mb-10">
          <input
            type="search"
            placeholder="Search by make or model…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-4 pr-10 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
            ⌕
          </span>
        </div>

        <AnimatePresence mode="wait">
          {loading && cars.length === 0 ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50"
            >
              <div className="text-center text-sm text-zinc-500">Loading the fleet…</div>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-64 items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 text-center text-sm text-red-700"
            >
              Something went wrong while loading the fleet.{' '}
              <button
                type="button"
                onClick={loadCars}
                className="font-semibold underline hover:no-underline"
              >
                Try again
              </button>
            </motion.div>
          ) : cars.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-64 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 px-6 text-center text-sm text-zinc-500"
            >
              No cars match that filter. Try a different category or search term.
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {cars.map((car, i) => (
                <FleetCard key={car._id} car={car} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
