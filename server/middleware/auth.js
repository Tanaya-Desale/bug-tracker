const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, access denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ msg: 'Invalid token' });
  }
};

module.exports = auth;