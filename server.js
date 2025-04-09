require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDatabase = require('./db/connection');
const productRoutes = require('./routes/product');
const registrationRouter = require('./routes/registration');
const loginRouter = require('./routes/login');
const userRoutes = require('./routes/user');
const userProductRouter = require('./routes/userProducts');
const cartRouter = require('./routes/cart');
const categoryProductRouter = require('./routes/categoryProduct');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDatabase();

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Routes
app.use('/api', productRoutes);
app.use('/api', registrationRouter);
app.use('/api', loginRouter);
app.use('/api/user', userRoutes);
app.use('/api', userProductRouter);
app.use('/api', cartRouter);
app.use('/api', categoryProductRouter);

app.listen(PORT, () => {
  try {
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});
