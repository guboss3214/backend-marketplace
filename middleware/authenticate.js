const jwt = require('jsonwebtoken');
const User = require('../schemas/User');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token)
    return res.status(401).json({ message: 'Please login to continue' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res
        .status(401)
        .json({ message: 'Token has expired, please login again' });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = {
      id: decoded.id,
      _id: decoded.id,
      ...decoded,
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Token has expired, please login again' });
    }
    res.status(403).json({ message: 'Invalid token, please login again' });
  }
};

module.exports = authenticate;
