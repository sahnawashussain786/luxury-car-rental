'use client';

import { motion } from 'framer-motion';

const STEPS = [
  {
    number: '01',
    title: 'Pick a car',
    description:
      'Browse the fleet and choose the supercar or hypercar you want for your trip.',
  },
  {
    number: '02',
    title: 'Choose your dates',
    description:
      'Select start and end dates, add driver details, and see your total before you commit.',
  },
  {
    number: '03',
    title: 'We release the car',
    description:
      'Same-day availability, insured delivery, and a manual you didn’t ask for but deserve.',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-zinc-100 bg-zinc-50 py-24 px-6 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            How it works
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Three steps. No filler.
          </h2>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              <div className="flex flex-col items-center text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white">
                  {step.number}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-zinc-900">{step.title}</h3>
                <p className="mt-3 max-w-xs text-zinc-500">{step.description}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-6 left-1/2 h-0.5 w-[50%] bg-zinc-200" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
