const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  street: {
    type: String,
    required: [true, 'Street address is required']
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  state: {
    type: String,
    required: [true, 'State is required']
  },
  country: {
    type: String,
    required: [true, 'Country is required']
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required']
  }
});

const orderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  productName: {
    type: String,
    required: [true, 'Product name is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price cannot be negative']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative']
  }
});

const orderNoteSchema = new Schema({
  content: {
    type: String,
    required: [true, 'Note content is required']
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Note creator is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const statusHistorySchema = new Schema({
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    required: [true, 'Status is required']
  },
  note: String,
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Status updater is required']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const shippingSchema = new Schema({
  address: {
    type: addressSchema,
    required: [true, 'Shipping address is required']
  },
  method: {
    type: String,
    required: [true, 'Shipping method is required']
  },
  trackingNumber: String,
  estimatedDeliveryDate: Date,
  actualDeliveryDate: Date,
  shippingCost: {
    type: Number,
    required: [true, 'Shipping cost is required'],
    min: [0, 'Shipping cost cannot be negative']
  }
});

const orderSchema = new Schema({
  orderNumber: {
    type: String,
    required: [true, 'Order number is required'],
    unique: true,
    index: true
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer ID is required'],
    index: true
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
    index: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  items: {
    type: [orderItemSchema],
    required: [true, 'Order items are required'],
    validate: [
      {
        validator: function(items) {
          return items.length > 0;
        },
        message: 'At least one item is required'
      }
    ]
  },
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: [0, 'Subtotal cannot be negative']
  },
  tax: {
    type: Number,
    required: [true, 'Tax is required'],
    min: [0, 'Tax cannot be negative']
  },
  shipping: {
    type: shippingSchema,
    required: [true, 'Shipping details are required']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  total: {
    type: Number,
    required: [true, 'Total is required'],
    min: [0, 'Total cannot be negative']
  },
  notes: [orderNoteSchema],
  statusHistory: [statusHistorySchema],
  expectedShipDate: Date,
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ 'items.productId': 1 });

// Virtuals
orderSchema.virtual('daysSinceCreated').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware
orderSchema.pre('save', function(next) {
  // Update timestamps
  this.updatedAt = new Date();
  
  // Calculate totals
  if (this.isModified('items')) {
    this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    this.total = this.subtotal + this.tax + this.shipping.shippingCost - (this.discount || 0);
  }

  // Add to status history if status changed
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      updatedBy: this.updatedBy || this.customerId, // Fallback to customer if no user specified
      timestamp: new Date()
    });
  }

  next();
});

// Methods
orderSchema.methods.addNote = function(content, userId) {
  this.notes.push({
    content,
    createdBy: userId,
    createdAt: new Date()
  });
  return this.save();
};

orderSchema.methods.updateStatus = function(status, userId, note) {
  this.status = status;
  this.statusHistory.push({
    status,
    note,
    updatedBy: userId,
    timestamp: new Date()
  });
  return this.save();
};

// Statics
orderSchema.statics.getOrderSummary = async function(startDate, endDate) {
  const match = {};
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) match.createdAt.$lte = new Date(endDate);
  }

  const summary = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' },
        ordersByStatus: {
          $push: {
            k: '$status',
            v: 1
          }
        },
        ordersByPaymentStatus: {
          $push: {
            k: '$paymentStatus',
            v: 1
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalOrders: 1,
        totalRevenue: 1,
        averageOrderValue: 1,
        ordersByStatus: { $arrayToObject: '$ordersByStatus' },
        ordersByPaymentStatus: { $arrayToObject: '$ordersByPaymentStatus' }
      }
    }
  ]);

  return summary[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    ordersByStatus: {},
    ordersByPaymentStatus: {}
  };
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;