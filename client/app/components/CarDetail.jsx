'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import CarViewer from './CarViewer';
import { api, setTokens, clearTokens } from '@/app/lib/api';

const SPEC_DISPLAY = {
  horsepower: { label: 'Power', short: true },
  torque: { label: 'Torque' },
  acceleration: { label: '0-60 mph' },
  topSpeed: { label: 'Top Speed' },
  drivetrain: { label: 'Drivetrain' },
  transmission: { label: 'Transmission' },
  powertrain: { label: 'Powertrain' },
};

function SpecTile({ label, value }) {
  return (
    <div className="rounded-xl border border-zinc-200/70 bg-white px-4 py-3 text-center shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-zinc-900">{value}</div>
    </div>
  );
}

export default function CarDetailPage({ params }) {
  const router = useRouter();
  const id = typeof params === 'object' ? params.id : params;

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [specs, setSpecs] = useState([]);

  const [currentImage, setCurrentImage] = useState(0);
  const [showBooking, setShowBooking] = useState(false);

  const [auth, setAuth] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [booking, setBooking] = useState({
    customerName: '',
    customerEmail: '',
    notes: '',
    startDate: '',
    endDate: '',
  });
  const [bookLoading, setBookLoading] = useState(false);
  const [bookError, setBookError] = useState(null);
  const [bookSuccess, setBookSuccess] = useState(null);
  const [checkout, setCheckout] = useState(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? window.__rentalTokens : null;
    if (!token?.accessToken) return;
    api.auth.me()
      .then(({ user }) => setAuth(user))
      .catch(() => setAuth(null));
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { car: loaded } = await api.cars.get(id);
        setCar(loaded);
        const rawSpecs = loaded?.specifications ?? {};
        const ordered = Object.entries(rawSpecs)
          .filter(([, value]) => value != null && value !== '')
          .map(([key, value]) => ({
            key,
            label: SPEC_DISPLAY[key]?.label ?? key,
            value: String(value),
            short: Boolean(SPEC_DISPLAY[key]?.short),
          }))
          .sort((a, b) => (b.short ? 1 : 0) - (a.short ? 1 : 0));
        setSpecs(ordered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAuth = async (event) => {
    event.preventDefault();
    setAuthLoading(true);
    setError(null);
    try {
      const body = new FormData(event.currentTarget);
      const payload = {
        email: body.get('email'),
        password: body.get('password'),
      };
      if (!payload.email || !payload.password) {
        throw new Error('Email and password are required.');
      }
      if (!auth) {
        const { token, user } = await api.auth.login(payload);
        setTokens({ accessToken: token });
        setAuth(user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const computeCheckout = () => {
    if (!car || !booking.startDate || !booking.endDate) {
      setCheckout(null);
      return;
    }
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    if (end <= start) {
      setCheckout(null);
      return;
    }
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    setCheckout({
      days,
      totalPrice: car.pricePerDay * days,
      currency: car.currency ?? 'USD',
    });
  };

  useEffect(() => {
    const timer = setTimeout(computeCheckout, 150);
    return () => clearTimeout(timer);
  }, [booking.startDate, booking.endDate, car]);

  const handleBooking = async (event) => {
    event.preventDefault();
    if (!auth) {
      setError('Sign in to book this car.');
      return;
    }
    setBookLoading(true);
    setBookError(null);
    setBookSuccess(null);
    try {
      const payload = {
        carId: id,
        startDate: booking.startDate,
        endDate: booking.endDate,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        notes: booking.notes,
      };
      const { booking: created, checkout: createdCheckout } = await api.bookings.create(payload);
      setBookSuccess(created);
      setCheckout(createdCheckout);
      setShowBooking(false);
    } catch (err) {
      setBookError(err.message);
    } finally {
      setBookLoading(false);
    }
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % (car?.images?.length ?? 1));
  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + (car?.images?.length ?? 1)) % (car?.images?.length ?? 1));

  return (
    <div className="min-h-screen bg-white">
      {loading && (
        <div className="flex h-screen items-center justify-center bg-zinc-50">
          <div className="text-center text-sm text-zinc-500">Loading car…</div>
        </div>
      )}

      {error && !car && (
        <div className="flex h-screen items-center justify-center bg-zinc-50">
          <div className="text-center">
            <p className="text-zinc-500">Couldn’t load this car.</p>
            <button
              type="button"
              onClick={() => router.push('/#fleet')}
              className="mt-3 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
            >
              Back to fleet
            </button>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!loading && car && (
          <motion.div
            key={car._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <header className="border-b border-zinc-100 bg-zinc-50/80 backdrop-blur-sm">
              <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
                <a
                  href="#fleet"
                  className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
                >
                  ← Back to fleet
                </a>
                <nav className="flex gap-6 text-sm font-medium text-zinc-500">
                  <a href="#specs" className="hover:text-zinc-900">Specs</a>
                  <a href="#gallery" className="hover:text-zinc-900">Gallery</a>
                  <a href="#booking" className="hover:text-zinc-900">Book now</a>
                </nav>
              </nav>
            </header>

            <div className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
              <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
                <div className="flex flex-col gap-6">
                  <CarViewer
                    car={car}
                    autoRotate={true}
                    accentColor="#b3b3b3"
                    className="aspect-square w-full max-w-3xl"
                  />

                  <div className="flex flex-wrap gap-3">
                    {car.images.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCurrentImage(i)}
                        className={`aspect-square overflow-hidden rounded-xl border-2 transition-colors ${
                          i === currentImage
                            ? 'border-zinc-900'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${car.make} ${car.model} view ${i + 1}`}
                          className="h-full w-full object-cover"
                          loading={i === 0 ? 'eager' : 'lazy'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-6 lg:pl-10">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-2"
                  >
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium uppercase tracking-widest text-zinc-500">
                      {car.category}
                    </span>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                      {car.make} {car.model}
                    </h1>
                    <p className="text-zinc-400">{car.year}</p>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-zinc-500"
                  >
                    {car.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-baseline gap-2 text-2xl font-bold text-zinc-900"
                  >
                    <span>${(car.pricePerDay ?? 0).toLocaleString()}</span>
                    <span className="text-zinc-400 text-base font-normal">/ day</span>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => setShowBooking((v) => !v)}
                    className="self-start rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
                  >
                    {showBooking ? 'Close booking' : 'Book now'}
                  </motion.button>
                </div>
              </div>

              <div id="specs" className="mt-16 border-t border-zinc-100 pt-12">
                <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900">Specifications</h2>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {specs.map(({ label, value }) => (
                    <SpecTile key={label} label={label} value={value} />
                  ))}
                </div>
              </div>

              <div id="gallery" className="mt-16 border-t border-zinc-100 pt-12">
                <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900">Gallery</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {car.images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentImage(i)}
                      className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 transition-colors hover:border-zinc-900"
                    >
                      <img
                        src={img}
                        alt={`${car.make} ${car.model} view ${i + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div id="booking" className="border-t border-zinc-100 bg-zinc-50/80 backdrop-blur-sm px-6 pb-24 pt-16 lg:px-12">
        <div className="mx-auto max-w-xl">
          <AnimatePresence mode="wait">
            {showBooking && car && (
              <motion.div
                key="booking"
                initial={{ opacity: 0, y: 16, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: 16, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg"
              >
                <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                  Book {car.make} {car.model}
                </h2>

                {!auth && (
                  <form onSubmit={handleAuth} className="mb-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm">
                    <p className="mb-3 font-medium text-zinc-700">
                      Sign in to continue booking
                    </p>
                    <div className="grid gap-3">
                      <input
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm placeholder-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                      />
                      <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm placeholder-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                      />
                      <button
                        type="submit"
                        className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
                      >
                        Sign in
                      </button>
                    </div>
                  </form>
                )}

                <div className="mb-4 flex items-center justify-between text-sm text-zinc-500">
                  <span>${car.pricePerDay?.toLocaleString()} / day</span>
                  {checkout && (
                    <span className="font-semibold text-zinc-900">
                      {checkout.days} day{checkout.days !== 1 ? 's' : ''} ·{' '}
                      ${(checkout.totalPrice ?? 0).toLocaleString()} {checkout.currency}
                    </span>
                  )}
                </div>

                <form onSubmit={handleBooking} className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-zinc-700">
                      Your name
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={booking.customerName}
                      onChange={(e) => setBooking({ ...booking, customerName: e.target.value })}
                      placeholder="Alex Rivera"
                      required
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm placeholder-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-zinc-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={booking.customerEmail}
                      onChange={(e) => setBooking({ ...booking, customerEmail: e.target.value })}
                      placeholder="alex@example.com"
                      required
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm placeholder-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700">
                      Start date
                    </label>
                    <input
                      type="date"
                      value={booking.startDate}
                      onChange={(e) => setBooking({ ...booking, startDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm placeholder-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700">
                      End date
                    </label>
                    <input
                      type="date"
                      value={booking.endDate}
                      onChange={(e) => setBooking({ ...booking, endDate: e.target.value })}
                      min={booking.startDate || new Date().toISOString().split('T')[0]}
                      required
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm placeholder-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-zinc-700">
                      Notes
                    </label>
                    <textarea
                      value={booking.notes}
                      onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                      placeholder="Delivery address, pickup time, special requests…"
                      rows={3}
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm placeholder-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                    />
                  </div>

                  {checkout && (
                    <div className="sm:col-span-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm">
                      <span className="font-medium text-zinc-700">Dummy checkout summary</span>
                      <span className="ml-2 text-zinc-500">— no real payment processed</span>
                      <div className="mt-2 flex justify-between font-semibold text-zinc-900">
                        <span>Total</span>
                        <span>${(checkout.totalPrice ?? 0).toLocaleString()} {checkout.currency}</span>
                      </div>
                    </div>
                  )}

                  <div className="sm:col-span-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowBooking(false)}
                      className="flex-1 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={bookLoading || !auth || !booking.startDate || !booking.endDate || !booking.customerName || !booking.customerEmail}
                      className="flex-1 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {bookLoading ? 'Booking…' : 'Confirm booking'}
                    </button>
                  </div>
                </form>

                <AnimatePresence>
                  {bookError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      {bookError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {bookSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800"
                    >
                      <span className="font-semibold">Booking confirmed (dummy)</span>
                      <p className="mt-1 text-zinc-600">
                        Your request has been logged as <span className="font-medium">{bookSuccess.status}</span>. In a real app, this is where you’d redirect to payment.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setShowBooking(false);
                          setBookSuccess(null);
                          setBooking({
                            customerName: '',
                            customerEmail: '',
                            notes: '',
                            startDate: '',
                            endDate: '',
                          });
                          setCheckout(null);
                        }}
                        className="mt-3 rounded-lg border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
                      >
                        Make another booking
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
