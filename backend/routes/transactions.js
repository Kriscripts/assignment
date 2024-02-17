const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get('/', async (req, res) => {
  try {
    const { month, search = '', page = 1, perPage = 10 } = req.query;

    // Validate month parameter
    if (!month) {
      return res.status(400).json({ success: false, message: 'Month parameter is required' });
    }

    const validatedPage = Math.max(parseInt(page, 10) || 1, 1);
    const validatedPerPage = Math.max(parseInt(perPage, 10) || 10, 1);

    // Create date filter for the selected month
    const dateFilter = createMonthFilter(month);

    // Create search filter
    const searchFilter = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        {
          $expr: {
            $and: [
              { $ifNull: ['$price', false] },  // Check if 'price' exists
              { $gte: ['$price', 0] },  // Check if 'price' is greater than or equal to 0
              { $lte: ['$price', Number.MAX_SAFE_INTEGER] },  // Check if 'price' is less than or equal to MAX_SAFE_INTEGER
              { $eq: [{ $type: '$price' }, 'number'] },  // Check if 'price' is of type number
            ],
          },
        },
      ],
    };
    
    // Combine date and search filters
    const combinedFilter = { $and: [dateFilter, searchFilter] };

    // Fetch transactions with pagination
    const transactions = await Product.find(combinedFilter)
    .skip((validatedPage - 1) * validatedPerPage)
    .limit(validatedPerPage);

    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ success: false, message: error.message });
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
