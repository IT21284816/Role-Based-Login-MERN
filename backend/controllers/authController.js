const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: 'User already exists' });
  }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(400).json({ error: 'Invalid credentials' });
  
      const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret', {
        expiresIn: '1h',
      });
  
      res.json({ token, role: user.role }); // ✅ Send role along with token
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  
