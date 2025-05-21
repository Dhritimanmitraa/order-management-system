const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { format } = require('date-fns');

// Validation middleware
const validateOrder = [
  body('orderNumber').optional().isString(),
  body('customerId').isMongoId(),
  body('customerName').isString(),
  body('items').isArray().notEmpty(),
  body('items.*.productId').isMongoId(),
  body('items.*.productName').isString(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('items.*.unitPrice').isFloat({ min: 0 }),
  body('shipping.address').isObject(),
  body('shipping.address.street').isString(),
  body('shipping.address.city').isString(),
  body('shipping.address.state').isString(),
  body('shipping.address.country').isString(),
  body('shipping.address.postalCode').isString(),
  body('shipping.method').isString(),
  body('shipping.shippingCost').isFloat({ min: 0 })
];

// Get all orders with filtering and pagination
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      startDate,
    
      endDate,
      customerId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (customerId) query.customerId = customerId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const orders = await Order.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Order.countDocuments(query);

    // Get summary if requested
    let summary;
    if (req.query.includeSummary === 'true') {
      summary = await Order.getOrderSummary(startDate, endDate);
    }

    res.json({
      orders,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      summary
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new order
router.post('/', [auth, validateOrder], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Generate order number
    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD${format(new Date(), 'yyyyMMdd')}${(orderCount + 1).toString().padStart(4, '0')}`;

    // Calculate totals
    const items = req.body.items.map(item => ({
      ...item,
      totalPrice: item.quantity * item.unitPrice
    }));

    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.1; // 10% tax rate
    const total = subtotal + tax + req.body.shipping.shippingCost - (req.body.discount || 0);

    const order = new Order({
      ...req.body,
      orderNumber,
      items,
      subtotal,
      tax,
      total,
      statusHistory: [{
        status: 'pending',
        updatedBy: req.user.id,
        timestamp: new Date()
      }]
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update order
router.put('/:id', [auth, validateOrder], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update fields
    Object.assign(order, req.body);
    order.updatedBy = req.user.id;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update order status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.updateStatus(status, req.user.id, note);
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add note to order
router.post('/:id/notes', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.addNote(content, req.user.id);
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Bulk update orders
router.patch('/bulk', auth, async (req, res) => {
  try {
    const { orderIds, updates } = req.body;
    const result = await Order.updateMany(
      { _id: { $in: orderIds } },
      { $set: updates }
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get order summary
router.get('/summary', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const summary = await Order.getOrderSummary(startDate, endDate);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export orders
router.get('/export', auth, async (req, res) => {
  try {
    const { format = 'csv', startDate, endDate, status } = req.query;
    
    // Build query
    const query = {};
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query).lean();

    if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Orders');

      // Add headers
      worksheet.columns = [
        { header: 'Order Number', key: 'orderNumber', width: 15 },
        { header: 'Customer', key: 'customerName', width: 20 },
        { header: 'Status', key: 'status', width: 12 },
        { header: 'Total', key: 'total', width: 12 },
        { header: 'Created At', key: 'createdAt', width: 20 }
      ];

      // Add rows
      orders.forEach(order => {
        worksheet.addRow({
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          status: order.status,
          total: order.total,
          createdAt: format(new Date(order.createdAt), 'PPP')
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');
      await workbook.xlsx.write(res);
    } else {
      // CSV format
      const csv = orders.map(order => {
        return `${order.orderNumber},${order.customerName},${order.status},${order.total},${format(new Date(order.createdAt), 'PPP')}`;
      }).join('\n');

      const headers = 'Order Number,Customer,Status,Total,Created At\n';

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
      res.send(headers + csv);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate invoice
router.get('/:id/invoice', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderNumber}.pdf`);
    doc.pipe(res);

    // Add company logo and header
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();

    // Add order details
    doc.fontSize(12)
      .text(`Order Number: ${order.orderNumber}`)
      .text(`Date: ${format(new Date(order.createdAt), 'PPP')}`)
      .text(`Customer: ${order.customerName}`)
      .moveDown();

    // Add shipping address
    doc.text('Shipping Address:')
      .text(order.shipping.address.street)
      .text(`${order.shipping.address.city}, ${order.shipping.address.state} ${order.shipping.address.postalCode}`)
      .text(order.shipping.address.country)
      .moveDown();

    // Add items table
    doc.text('Items:').moveDown();
    order.items.forEach(item => {
      doc.text(`${item.productName} - ${item.quantity} x $${item.unitPrice} = $${item.totalPrice}`);
    });
    doc.moveDown();

    // Add totals
    doc.text(`Subtotal: $${order.subtotal}`)
      .text(`Tax: $${order.tax}`)
      .text(`Shipping: $${order.shipping.shippingCost}`);
    if (order.discount) {
      doc.text(`Discount: -$${order.discount}`);
    }
    doc.fontSize(14).text(`Total: $${order.total}`, { bold: true });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;