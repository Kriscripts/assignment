const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get('/', async (req, res) => {
  console.log('Pie chart route is being hit!');
    try {
      // Get the month from the query parameters
      const { month } = req.query;
      console.log('Month:', month);
  
      // Use MongoDB aggregation to group by category and count items for the specified month
      const categoryCounts = await Product.aggregate([
        {
          $match: {
            dateOfSale: {
              $gte: new Date(`${month}-01T00:00:00Z`),
              $lt: new Date(`${month}-31T23:59:59Z`),
            },
          },
        },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
          },
        },
      ]);
  
      // Construct the response data in the desired format
      const pieChartData = categoryCounts.map(({ _id, count }) => ({ category: _id, count }));
  
      // Send the pie chart data as a JSON response
      res.json({ success: true, data: pieChartData });
    } catch (error) {
      // Handle errors and send an error response
      console.error(error);
      res.status(500).json({ success: false, message: 'Error generating pie chart data' });
    }
  });
module.exports = router;