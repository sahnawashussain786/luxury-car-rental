const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

router.get('/', async (req, res) => {
  try {
    const { available, category, query } = req.query;
    const filter = {};
    if (available === 'true') filter.available = true;
    if (category) filter.category = category;
    if (query) {
      filter.$or = [
        { make: { $regex: query, $options: 'i' } },
        { model: { $regex: query, $options: 'i' } },
      ];
    }
    const cars = await Car.find(filter).sort({ pricePerDay: 1 });
    res.json({ cars });
  } catch (err) {
    console.error('List cars error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json({ car });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Car not found' });
    }
    console.error('Get car error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const payload = require('jsonwebtoken').verify(
      token,
      process.env.JWT_SECRET || 'luxury-rental-dev-secret-change-in-prod'
    );
    if (payload.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const car = await Car.create(req.body);
    res.status(201).json({ car });
  } catch (err) {
    console.error('Create car error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const payload = require('jsonwebtoken').verify(
      token,
      process.env.JWT_SECRET || 'luxury-rental-dev-secret-change-in-prod'
    );
    if (payload.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json({ car });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Car not found' });
    }
    console.error('Update car error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
