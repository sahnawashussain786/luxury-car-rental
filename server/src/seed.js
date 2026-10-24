const mongoose = require('mongoose');
const Car = require('./models/Car');
const User = require('./models/User');
const connectDB = require('./db');

const ADMIN_USER = {
  name: 'Admin User',
  email: 'admin@luxuryrental.com',
  // Placeholder password. Change after first login, or set a real one here.
  password: 'AdminPass1',
  role: 'admin',
};

const FLEET = [
  {
    make: 'Ferrari',
    model: 'SF90 Stradale',
    year: 2024,
    category: 'supercar',
    pricePerDay: 1250,
    currency: 'USD',
    description:
      'A devastatingly quick PHEV supercar with 986 hp, quad-turbo V8 plus three electric motors, and F1-derived tech. Zero to sixty in 2.5 seconds.',
    specifications: {
      powertrain: '3.9L Twin-Turbo V8 + 3 Electric Motors',
      horsepower: '986 hp',
      torque: '738 lb-ft',
      transmission: '8-speed DCT',
      drivetrain: 'AWD',
      topSpeed: '211 mph',
      acceleration: '0-60 mph in 2.5s',
    },
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80',
    ],
    modelPath: null,
    available: true,
  },
  {
    make: 'Lamborghini',
    model: 'Huracan Tecnica',
    year: 2023,
    category: 'supercar',
    pricePerDay: 950,
    currency: 'USD',
    description:
      'The sharper, more connected Huracan. A 5.2L naturally aspirated V10 singing at 9,000 rpm, rear-wheel drive, and a chassis built for canyon carving.',
    specifications: {
      powertrain: '5.2L Naturally Aspirated V10',
      horsepower: '640 hp',
      torque: '417 lb-ft',
      transmission: '7-speed DCT',
      drivetrain: 'RWD',
      topSpeed: '202 mph',
      acceleration: '0-60 mph in 3.2s',
    },
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&q=80',
    ],
    modelPath: null,
    available: true,
  },
  {
    make: 'McLaren',
    model: '720S',
    year: 2024,
    category: 'supercar',
    pricePerDay: 1100,
    currency: 'USD',
    description:
      'A mono-cage carbon fiber masterpiece with a 710 hp twin-turbo V8, active aerodynamics, and one of the best driver-focused cabins in the business.',
    specifications: {
      powertrain: '4.0L Twin-Turbo V8',
      horsepower: '710 hp',
      torque: '568 lb-ft',
      transmission: '7-speed SSG',
      drivetrain: 'AWD',
      topSpeed: '212 mph',
      acceleration: '0-60 mph in 2.7s',
    },
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&q=80',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200&q=80',
    ],
    modelPath: null,
    available: true,
  },
  {
    make: 'Porsche',
    model: '911 Turbo S',
    year: 2024,
    category: 'supercar',
    pricePerDay: 850,
    currency: 'USD',
    description:
      'The benchmark all-rounder. 640 hp twin-turbo flat-six, AWD, and a demonic yet usable character that makes it as comfortable on the autobahn as the Nordschleife.',
    specifications: {
      powertrain: '3.8L Twin-Turbo Flat-6',
      horsepower: '640 hp',
      torque: '590 lb-ft',
      transmission: '8-speed PDK',
      drivetrain: 'AWD',
      topSpeed: '205 mph',
      acceleration: '0-60 mph in 2.6s',
    },
    images: [
      'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780477-8cdae7c25265?w=1200&q=80',
    ],
    modelPath: null,
    available: true,
  },
  {
    make: 'Aston Martin',
    model: 'DBS Superleggera',
    year: 2023,
    category: 'supercar',
    pricePerDay: 780,
    currency: 'USD',
    description:
      'Grand touring with teeth. A hand-built 5.2L twin-turbo V12 delivering 715 hp through a smooth ZF 8-speed, wrapped in Aston’s most athletic bodywork.',
    specifications: {
      powertrain: '5.2L Twin-Turbo V12',
      horsepower: '715 hp',
      torque: '516 lb-ft',
      transmission: '8-speed Automatic',
      drivetrain: 'RWD',
      topSpeed: '202 mph',
      acceleration: '0-60 mph in 3.4s',
    },
    images: [
      'https://images.unsplash.com/photo-1619642683890-8e571a3a0a4c?w=1200&q=80',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80',
    ],
    modelPath: null,
    available: true,
  },
  {
    make: 'Bugatti',
    model: 'Chiron',
    year: 2022,
    category: 'hypercar',
    pricePerDay: 5000,
    currency: 'USD',
    description:
      'One of the last W16-era Bugattis. 1,500 hp from an 8.0L quad-turbo W16, 271 mph top speed on the right spec, and a level of engineering that reads like science fiction.',
    specifications: {
      powertrain: '8.0L Quad-Turbo W16',
      horsepower: '1500 hp',
      torque: '1180 lb-ft',
      transmission: '7-speed Dual-Clutch',
      drivetrain: 'AWD',
      topSpeed: '261 mph (limited)',
      acceleration: '0-60 mph in 2.3s',
    },
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80',
    ],
    modelPath: null,
    available: true,
  },
  {
    make: 'Rimac',
    model: 'Nevera',
    year: 2024,
    category: 'hypercar',
    pricePerDay: 4200,
    currency: 'USD',
    description:
      'The electric hypercar that embarrasses most combustion cars off the line. 1,914 hp, four independent motors, and a 0-60 time that barely fits on a stopwatch.',
    specifications: {
      powertrain: 'Quad Electric Motors',
      horsepower: '1914 hp',
      torque: '1740 lb-ft',
      transmission: 'Single-speed',
      drivetrain: 'AWD',
      topSpeed: '258 mph',
      acceleration: '0-60 mph in 1.74s',
    },
    images: [
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&q=80',
    ],
    modelPath: null,
    available: true,
  },
  {
    make: 'Pagani',
    model: 'Huayra Roadster',
    year: 2023,
    category: 'hypercar',
    pricePerDay: 4800,
    currency: 'USD',
    description:
      'Artistry with an AMG-sourced 6.0L twin-turbo V12, 725 hp, and a titanium/aluminum monocoque that sounds as good as it looks. Exhaust note for the ages.',
    specifications: {
      powertrain: '6.0L Twin-Turbo V12 (AMG)',
      horsepower: '725 hp',
      torque: '664 lb-ft',
      transmission: '7-speed DCT',
      drivetrain: 'RWD',
      topSpeed: '238 mph',
      acceleration: '0-60 mph in 3.2s',
    },
    images: [
      'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780477-8cdae7c25265?w=1200&q=80',
    ],
    modelPath: null,
    available: true,
  },
];

const seed = async () => {
  await connectDB();
  await Car.deleteMany({});
  await User.deleteMany({});
  await Car.insertMany(FLEET);
  const admin = await User.create(ADMIN_USER);
  console.log(`Seeded ${FLEET.length} cars.`);
  console.log(`Seeded admin: ${admin.email} (password: ${ADMIN_USER.password})`);
  console.log('Change the admin password immediately after first login.');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
