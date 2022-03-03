const express = require('express');
const router = express.Router();

//@route  GET api/AUTH
//@desc   TEST route
//@access PUBLIC
router.get('/', (req, res) => {
  res.send('AUTH ROUTE');
});

module.exports=router;