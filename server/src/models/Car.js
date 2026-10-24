const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['supercar', 'hypercar', 'luxury'],
      default: 'supercar',
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    description: {
      type: String,
      required: true,
    },
    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    images: {
      type: [String],
      default: [],
    },
    modelPath: {
      type: String,
      default: null,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

carSchema.index({ make: 1, model: 1 });

module.exports = mongoose.model('Car', carSchema);
