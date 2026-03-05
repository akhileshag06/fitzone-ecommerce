# 🏋️ FIT ZONE - E-Commerce Platform

A full-stack e-commerce platform for fitness supplements and gym equipment with advanced features including live chat, dealer management, and real-time notifications.

## 🌐 Live Demo

**Website**: https://fitzone-ecommerce.onrender.com

**API**: https://fitzone-backend-x2r9.onrender.com

## 📋 Features

### 🛒 E-Commerce Core
- Product browsing with advanced filtering and search
- Shopping cart with real-time updates
- Secure checkout with Razorpay payment integration
- Order tracking and history
- Product reviews and ratings
- Wishlist functionality
- Coupon/discount system

### 👥 User Management
- User registration and authentication
- JWT-based secure sessions
- Profile management
- Order history tracking
- Personalized dashboard

### 👨‍💼 Admin Panel
- Complete dashboard with analytics
- Product management (CRUD operations)
- Order management and status updates
- User management
- Dealer approval system
- Live chat support
- Real-time notifications
- Sales statistics and reports

### 🤝 Dealer System
- Dealer registration with admin approval
- Dealer dashboard with analytics
- Product submission for approval
- Customer assignment
- Commission tracking
- Order management for assigned customers

### 💬 Live Chat Support
- Real-time chat between users and admin/dealers
- Session management
- Message history
- Unread message indicators
- Chat status tracking (pending, active, closed)

### 🔔 Notification System
- Real-time notifications for orders, chats, and approvals
- Mark as read functionality
- Priority-based notifications
- Role-based notification routing

### 🤖 AI Chatbot
- Interactive product recommendations
- Fitness guidance
- Order assistance
- Live chat escalation

### 🎨 UI/UX Features
- Fully responsive design (mobile, tablet, desktop)
- Dark theme with gradient effects
- Smooth animations and transitions
- Interactive product cards
- PWA support
- Theme toggle (light/dark)

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.0 - UI library
- **React Router** 7.13.0 - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool
- **Styled Components** - CSS-in-JS

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (MongoDB Atlas)
- **Mongoose** - ODM
- **JWT** - Authentication
- **Razorpay** - Payment gateway
- **Bcrypt** - Password hashing

### Deployment
- **Frontend**: Render (Static Site)
- **Backend**: Render (Web Service)
- **Database**: MongoDB Atlas

## 📁 Project Structure

```
fitzone-ecommerce/
├── Backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & upload middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── scripts/         # Utility scripts
│   ├── public/images/   # Product images
│   └── server.js        # Entry point
├── E-com/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── utils/       # Helper functions
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── public/          # Static assets
│   └── vite.config.js   # Vite configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Razorpay account (for payments)

### Installation

1. Clone the repository
```bash
git clone https://github.com/akhileshag06/fitzone-ecommerce.git
cd fitzone-ecommerce
```

2. Install backend dependencies
```bash
cd Backend
npm install
```

3. Install frontend dependencies
```bash
cd ../E-com
npm install
```

4. Configure environment variables

Create `Backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NODE_ENV=development
```

Create `E-com/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Seed the database
```bash
cd Backend
node scripts/createAdmin.js
node scripts/seedProducts.js
```

6. Run the application

Backend:
```bash
cd Backend
npm start
```

Frontend:
```bash
cd E-com
npm run dev
```

## 🔑 Default Credentials

### Admin
- **Email**: admin@fitzone.com
- **Password**: Admin@123

### Dealer Registration Key
- **Key**: Akhilesh@8310

## 📱 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/admin/login` - Admin login
- `POST /api/dealer/login` - Dealer login
- `POST /api/dealer/register` - Dealer registration

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin/Dealer)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

### Chat
- `POST /api/chat/request` - Create chat session
- `GET /api/chat/sessions` - Get chat sessions
- `POST /api/chat/:sessionId/message` - Send message
- `GET /api/chat/:sessionId/messages` - Get messages

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

## 🎯 Key Features Implementation

### Payment Integration
- Razorpay payment gateway integration
- Secure payment verification
- Order creation on successful payment
- Automatic stock updates

### Real-time Features
- Polling-based chat updates (3-second intervals)
- Live notification updates (5-second intervals)
- Session status tracking

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (User, Admin, Dealer)
- Protected routes and API endpoints

### Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px
- Flexible layouts with flexbox
- Touch-friendly UI elements

## 📊 Database Models

- **User** - User accounts (users, admins, dealers)
- **Product** - Product catalog
- **Order** - Order records
- **Cart** - Shopping cart items
- **ChatSession** - Chat sessions
- **ChatMessage** - Chat messages
- **Notification** - User notifications

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**Akhilesh**
- GitHub: [@akhileshag06](https://github.com/akhileshag06)

## 🙏 Acknowledgments

- React team for the amazing library
- MongoDB for the database solution
- Render for hosting services
- Razorpay for payment integration

---

**Note**: This is a demonstration project. For production use, additional security measures and optimizations are recommended.
