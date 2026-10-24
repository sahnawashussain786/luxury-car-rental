'use client';

import { motion } from 'framer-motion';
import CarViewer from './CarViewer';

export default function LandingHero() {
  const heroCar = {
    make: 'Ferrari',
    model: 'SF90 Stradale',
    color: '#e6e6e6',
  };

  return (
    <section className="relative flex min-h-[80vh] flex-col lg:flex-row">
      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-20 lg:px-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="inline-block rounded-full border border-zinc-900/20 bg-zinc-900/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-900 backdrop-blur-sm">
            Exclusive fleet
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl"
        >
          Drive the{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600">
            unobtainable
          </span>
          , for a weekend.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-500"
        >
          Same-day access to the world’s sharpest supercars and hypercars.
          Pick a car, choose your dates, and let us handle the rest.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <a
            href="#fleet"
            className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            Explore the fleet
            <span aria-hidden="true" className="ml-2">
              →
            </span>
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-300 px-6 py-3.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            How it works
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 flex items-center gap-6 text-sm text-zinc-500"
        >
          {[
            'Same-day release',
            'Insured delivery',
            '24/7 support',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-white text-[10px] font-bold">
                ✓
              </span>
              {item}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="relative z-0 flex-1 overflow-hidden bg-zinc-50">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-zinc-50 via-white to-transparent" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_800px_at_70%_20%,rgba(0,0,0,0.06),transparent)]" />
        <div className="h-full max-h-[600px] w-full">
          <CarViewer car={heroCar} autoRotate={true} accentColor="#b3b3b3" />
        </div>
      </div>
    </section>
  );
}
