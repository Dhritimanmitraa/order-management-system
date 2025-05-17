# Order Management System

A modern, feature-rich order management system built with React, Node.js, and MongoDB.

![Order Management System](https://img.shields.io/badge/Order-Management-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-16.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0-green)

## 🌟 Features

- **Modern UI/UX**
  - Material-UI based responsive design
  - Intuitive dashboard and navigation
  - Real-time updates and notifications

- **Advanced Order Management**
  - Comprehensive order tracking
  - Status updates with history
  - Bulk order processing
  - Advanced filtering and sorting

- **Customer Management**
  - Customer profiles and history
  - Order history per customer
  - Customer communication tools

- **Inventory Integration**
  - Real-time stock updates
  - Low stock alerts
  - Product management

- **Reporting & Analytics**
  - Sales analytics
  - Order trends
  - Export functionality (CSV/Excel)
  - Invoice generation

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Dhritimanmitraa/order-management-system.git
   cd order-management-system
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Backend (.env)
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000

   # Frontend (.env)
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd ../frontend
   npm start
   ```

## 🛠️ Tech Stack

- **Frontend**
  - React
  - Material-UI
  - Redux Toolkit
  - TypeScript
  - Axios

- **Backend**
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - JWT Authentication

## 📝 API Documentation

The API documentation is available at `/api-docs` when running the server locally.

### Key Endpoints

- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Dhritiman Mitra** - *Initial work* - [Dhritimanmitraa](https://github.com/Dhritimanmitraa)

## 🙏 Acknowledgments

- Material-UI for the amazing component library
- MongoDB for the robust database solution
- All contributors who have helped shape this project