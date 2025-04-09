const express = require('express');
const router = express.Router();
const User = require('../schemas/User');
const Product = require('../schemas/Product');

router.get('/user/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(productId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const products = await Product.find({ _id: { $in: user.products } });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get user products', error });
  }
});

router.get('/user/userinfo/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const product = await Product.findOne({ user: userId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(userId).select('username email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to get user information', error });
  }
});

module.exports = router;
