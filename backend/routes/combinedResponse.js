const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get('/', async (req, res) => {
    try {
      // Fetch data from the three APIs concurrently using Promise.all
      const { month } = req.query;
      const defaultMonth = '2021-09';

      const [pieChartResponse, barChartResponse, statisticsResponse] = await Promise.all([
        axios.get(`http://localhost:3000/pie-chart?month=${month || defaultMonth}`),
        axios.get(`http://localhost:3000/bar-chart?month=${month || defaultMonth}`),
        axios.get(`http://localhost:3000/statistics?month=${month || defaultMonth}`),
      ]);
  
      // Combine the responses into a single object
      const combinedResponse = {
        pieChart: pieChartResponse.data,
        barChart: barChartResponse.data,
        statistics: statisticsResponse.data,
      };
  
      // Send the combined response as a JSON response
      res.json({ success: true, data: combinedResponse });
    } catch (error) {
      // Handle errors and send an error response
      console.error(error);
      res.status(500).json({ success: false, message: 'Error generating combined response' });
    }
  });

module.exports = router;
