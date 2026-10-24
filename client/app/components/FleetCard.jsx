'use client';

import { motion } from 'framer-motion';

const SPEC_LABELS = {
  horsepower: 'Power',
  acceleration: '0-60',
  topSpeed: 'Top Speed',
  drivetrain: 'Drive',
};

export default function FleetCard({ car, index = 0, onClick }) {
  const rawSpecs = car?.specifications ?? {};
  const specs = Object.entries(rawSpecs)
    .filter(([, value]) => value != null && value !== '')
    .slice(0, 4)
    .map(([key, value]) => ({
      label: SPEC_LABELS[key] ?? key,
      value: String(value),
    }));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5 transition-shadow hover:shadow-2xl"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-900">
        <img
          src={car?.images?.[0] ?? 'https://placehold.co/800x800/111/333?text=Car'}
          alt={`${car?.make} ${car?.model}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-3 top-3 rounded-full bg-black/40 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white backdrop-blur-sm">
          {car?.category ?? 'Supercar'}
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-black/40 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white backdrop-blur-sm">
          {car?.year ?? '—'}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1 flex items-baseline gap-2">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900">
            {car?.make ?? '—'}
          </h3>
          <span className="text-sm text-zinc-500">{car?.model ?? ''}</span>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-zinc-500">
          {car?.description ?? ''}
        </p>

        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium uppercase tracking-wide text-zinc-400">
          {specs.map(({ label, value }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="text-zinc-400">{label}</span>
              <span className="text-zinc-900">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-baseline gap-2 text-lg font-semibold tracking-tight text-zinc-900">
          <span>${(car?.pricePerDay ?? 0).toLocaleString()}</span>
          <span className="text-zinc-400 text-sm font-normal">/ day</span>
        </div>

        <div className="mt-3 flex w-full justify-end">
          <button
            type="button"
            className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            View in 3D
          </button>
        </div>
      </div>
    </motion.div>
  );
}
