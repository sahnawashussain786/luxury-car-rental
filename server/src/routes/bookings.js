const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'luxury-rental-dev-secret-change-in-prod';

const getUserId = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET).id;
  } catch {
    return null;
  }
};

router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const bookings = await Booking.find({ user: userId })
      .populate('car', 'make model year pricePerDay currency images specifications description')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    console.error('List bookings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/admin', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('car', 'make model year pricePerDay currency images available')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    console.error('Admin bookings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const { carId, startDate, endDate, customerName, customerEmail, notes } = req.body;
    if (!carId || !startDate || !endDate || !customerName || !customerEmail) {
      return res.status(400).json({ message: 'carId, startDate, endDate, customerName, and customerEmail are required' });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      return res.status(400).json({ message: 'endDate must be after startDate' });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    if (!car.available) {
      return res.status(400).json({ message: 'Car is not available for booking' });
    }

    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const totalPrice = car.pricePerDay * days;

    const overlap = await Booking.findOne({
      car: carId,
      status: { $in: ['pending', 'confirmed', 'active'] },
      $or: [
        { startDate: { $lt: end }, endDate: { $gt: start } },
      ],
    });
    if (overlap) {
      return res.status(409).json({ message: 'The car is already booked for the selected dates' });
    }

    const booking = await Booking.create({
      user: userId,
      car: carId,
      startDate: start,
      endDate: end,
      totalPrice,
      currency: car.currency || 'USD',
      status: 'pending',
      customerName,
      customerEmail,
      notes: notes || '',
    });

    await booking.populate([
      { path: 'car', select: 'make model year pricePerDay currency images' },
    ]);

    res.status(201).json({
      booking,
      checkout: {
        status: 'dummy',
        totalPrice,
        currency: car.currency || 'USD',
        days,
        message: 'Dummy checkout — no real payment was processed.',
      },
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Car not found' });
    }
    console.error('Create booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'status is required' });
    }
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ booking });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    console.error('Update booking status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
