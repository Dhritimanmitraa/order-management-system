const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  supplier: {
    name: String,
    email: String,
    phone: String
  },
  images: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  stockLevel: {
    type: Number
  },
  lastRestocked: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date, default: Date.now
  }
});

// Update timestamp on save
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if product is in stock
productSchema.methods.isInStock = function () {
  return this.quantity > 0;
};

// Method to update stock quantity
productSchema.methods.updateStock = function(quantity) {
  this.stockQuantity += quantity;
  return this.save();
};
