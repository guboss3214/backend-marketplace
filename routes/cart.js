const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const Product = require('../schemas/Product');
const Cart = require('../schemas/Cart');

router.post('/cart/add', authenticate, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        products: [
          {
            product: productId,
            quantity: 1,
          },
        ],
      });
    } else {
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product?.toString() === productId
      );

      if (existingProductIndex > -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        cart.products.push({
          product: productId,
          quantity: 1,
        });
      }
    }

    await cart.save();

    await cart.populate('products.product');

    res.status(200).json({
      message: 'Product added to cart',
      cart: cart,
    });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({
      error: 'Failed to add product to cart',
      details: error.message,
    });
  }
});

router.get('/cart', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate(
      'products.product'
    );
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      error: 'Failed to fetch cart',
      details: error.message,
    });
  }
});

router.delete('/cart/remove/:productId', authenticate, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      {
        $pull: {
          products: { product: productId },
        },
      },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.status(200).json({
      message: 'Product removed from cart',
      cart: cart,
    });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({
      error: 'Failed to remove product from cart',
      details: error.message,
    });
  }
});

router.put('/cart/update/:productId', authenticate, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOneAndUpdate(
      {
        user: userId,
        'products.product': productId,
      },
      {
        $set: {
          'products.$.quantity': quantity,
        },
      },
      {
        new: true,
      }
    ).populate('products.product');

    if (!cart) {
      return res.status(404).json({ error: 'Cart or product not found' });
    }

    res.status(200).json({
      message: 'Cart updated successfully',
      cart: cart,
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({
      error: 'Failed to update cart',
      details: error.message,
    });
  }
});

module.exports = router;
