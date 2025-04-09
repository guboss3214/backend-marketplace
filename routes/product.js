const express = require('express');
const Product = require('../schemas/Product');
const authenticate = require('../middleware/authenticate');
const User = require('../schemas/User');
const router = express.Router();

router.post('/products', authenticate, async (req, res) => {
  try {
    const { name, description, category, price, image } = req.body;
    const newProduct = new Product({
      name,
      description,
      category,
      price,
      image,
      user: req.user.id,
    });
    await newProduct.save();
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { products: newProduct.id } },
      { new: true }
    );
    res.status(201).send({ message: 'Product added successfully' });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Error adding record', error: err.message });
  }
});

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/products/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res
      .status(200)
      .json({ message: 'Product updated successfully', updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete('/products/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { products: id },
    });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
