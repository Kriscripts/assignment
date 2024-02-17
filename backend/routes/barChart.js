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

    // Find products in the specified month
    const productsInMonth = await Product.find(dateFilter);

    // Calculate the count in each price range
    const priceRanges = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    const barChartData = priceRanges.map((range) => {
      const count = productsInMonth.filter(product => product.price > range && product.price <= range + 100).length;
      return { range: `${range + 1} - ${range + 100}`, count };
    });

    res.json({ success: true, data: { barChartData } });
  } catch (error) {
    console.error('Error generating bar chart data:', error.message);
    res.status(500).json({ success: false, message: 'Error generating bar chart data' });
  }
});

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
