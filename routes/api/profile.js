const express = require('express');
const router = express.Router();

//@route  GET api/PROFILE
//@desc   TEST route
//@access PUBLIC
router.get('/', (req, res) => {
  res.send('PROFILE ROUTE');
});

module.exports=router;