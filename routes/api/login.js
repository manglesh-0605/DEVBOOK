const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { findOne } = require('../../models/User');

//@route  Post api/login
//@desc   Login existing  user--
//@access PUBLIC
router.post(
  '/',
  [
    check('email', 'please incluse a valid email').isEmail(),
    check('password', 'Please enter a valid password').exists(),
  ],
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecretToken'),
        { expiresIn: 3600000 },
        (err, token) => {
          res.json({
            token: token,
            user: { ...user._doc, password: 'nhi milega😂 ' },
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
