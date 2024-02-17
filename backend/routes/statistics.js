const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get('/', async (req, res) => {
  try {
    const { month } = req.query;
    
    if (!month) {
      throw new Error('Month parameter is required');
    }

    const dateFilter = createMonthFilter(month);

    // Find all products where the month part of dateOfSale matches the provided month
    const soldProducts = await Product.find(dateFilter);

    // Calculate total sale amount, total sold items, and total not sold items
    const totalSaleAmount = soldProducts.reduce((total, product) => {
      if (product.sold) {
        return total + product.price;
      }
      return total;
    }, 0);

    const totalSoldItems = soldProducts.filter(product => product.sold).length;
    const totalNotSoldItems = soldProducts.filter(product => !product.sold).length;

    res.json({
      success: true,
      data: {
        totalSaleAmount,
        totalSoldItems,
        totalNotSoldItems,
      },
    });
  } catch (error) {
    console.error('Error calculating statistics:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


// Function to create a date filter based on numeric or named month representation
function createMonthFilter(month) {
const monthNumber = parseInt(month, 10);

if (!isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12) {
  return {
    $expr: {
      $eq: [{ $month: '$dateOfSale' }, monthNumber],
    },
  };
}

const monthNames = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

const normalizedMonth = month.toLowerCase();
const monthIndex = monthNames.indexOf(normalizedMonth);

if (monthIndex !== -1) {
  return {
    $expr: {
      $eq: [{ $month: '$dateOfSale' }, monthIndex + 1],
    },
  };
}

throw new Error('Invalid month parameter');
}

module.exports = router;
