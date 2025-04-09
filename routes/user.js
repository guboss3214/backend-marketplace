const express = require('express');
const Product = require('../schemas/Product');
const User = require('../schemas/User');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.log('Error get user info:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/update/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User update successfully', user });
  } catch (error) {
    console.log('Error update user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/delete/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await Product.deleteMany({ user: id });
    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.log('Error delete user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
