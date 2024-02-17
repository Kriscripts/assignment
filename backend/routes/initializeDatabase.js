const express = require('express');
const axios = require('axios');
const router = express.Router();
const Product = require('../models/product');

router.get('/', async (req, res) => {
    try {
      
      const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
  
      const products = response.data;
  
      await Product.insertMany(products);
      
  
      res.json({ success: true, message: 'Database initialized successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error initializing database' });
    }
  });

module.exports = router;
