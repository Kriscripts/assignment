const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectToDatabase } = require('./config/database');
const initializeDatabaseRoute = require('./routes/initializeDatabase');
const transactionsRoute = require('./routes/transactions');
const statisticsRoute = require('./routes/statistics.js');
const barChartRoute = require('./routes/barChart');
const pieChartRoute = require('./routes/pieChart.js');
const combinedResponseRoute = require('./routes/combinedResponse');

const app = express();
const port = process.env.PORT || 3000;

// Connect to the database
connectToDatabase();

// Middleware
app.use(express.json());
app.use(cors());


app.use('/statistics', statisticsRoute);
app.use('/initialize-database', initializeDatabaseRoute);
app.use('/transactions', transactionsRoute);
app.use('/bar-chart', barChartRoute);
app.use('/pie-chart', pieChartRoute);
app.use('/combined-response', combinedResponseRoute);




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
