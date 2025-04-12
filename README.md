# 🛍️ Backend Marketplace

This is the backend for the marketplace, built with modern technologies. It handles the logic for product management, user authentication, cart operations, and more.

## 🚀 Tech Stack

- **Express** — Web framework for Node.js
- **Mongoose** — MongoDB object modeling
- **MongoDB** — NoSQL database for storing data
- **JWT** — JSON Web Tokens for user authentication
- **bcrypt** — Password hashing for secure authentication

## 📦 Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/guboss3214/backend-marketplace.git
   cd backend-marketplace
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file at the root of the project and add the following environment variables:

   ```env
    PORT = 3000
    FRONTEND_URL=http://localhost:5173
    CLOUDINARY_KEY=your_cloudinary_key
    CLOUDINARY_SECRET=your_cloudinary_secret
    CLOUDINARY_URL=your_cloudinary_url
    DB_PASSWORD=your_db_pass
    JWT_SECRET=your_secret_key
    DB_URL=your_db_url
   ```

4. Run the server:
   ```bash
   npm start
   ```

## 🛣️ API Routes

Here are the available routes for the API:

- **`/api`** — Base route for the API
- **`/api/products`** — Access and manage products
- **`/api/registration`** — User registration
- **`/api/login`** — User login
- **`/api/user`** — Manage user data
- **`/api/user/products`** — User's products
- **`/api/cart`** — User cart management
- **`/api/categories`** — Product categories

Example of how routes are set up in `app.js`:

```js
app.use('/api', productRoutes);
app.use('/api', registrationRouter);
app.use('/api', loginRouter);
app.use('/api/user', userRoutes);
app.use('/api', userProductRouter);
app.use('/api', cartRouter);
app.use('/api', categoryProductRouter);
```
