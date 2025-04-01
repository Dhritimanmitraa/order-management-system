# Order Management System

A modern, responsive order management system built with React, TypeScript, and Vite. This application helps businesses manage their orders, customers, products, and payments efficiently.

## Features

- **Dashboard**: Overview of key metrics and recent activities
- **Order Management**: Create, view, and manage orders
- **Customer Management**: Maintain customer information and order history
- **Product Catalog**: Manage product inventory and details
- **Payment Tracking**: Monitor payment status and transaction history
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Tech Stack

- React
- TypeScript
- Vite
- Material-UI
- Redux Toolkit (for state management)

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd order-management-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Build for Production

To create a production build:

```bash
 npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── features/       # Feature-specific components and logic
  ├── pages/          # Page components
  ├── App.tsx         # Root component
  ├── main.tsx        # Entry point
  └── store.ts        # Redux store configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.