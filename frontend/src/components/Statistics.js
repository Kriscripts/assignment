import React, { useState, useEffect } from 'react';
import './Statistics.css'; 

const Statistics = () => {
  const [months] = useState([
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]);
  const [selectedMonth, setSelectedMonth] = useState('June');
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedMonth !== '') {
      fetchStatistics();
    }
  }, [selectedMonth]);

  const fetchStatistics = async () => {
    try {

      
      const response = await fetch(`http://localhost:3000/statistics?month=${selectedMonth}`);
      const data = await response.json();

      if (response.ok) {
        setStatistics(data.data);
        setError(null);
      } else {
        setStatistics(null);
        setError(data.message || 'Error fetching statistics');
      }
    } catch (error) {
      setStatistics(null);
      setError('Error fetching statistics. Please try again later.');
    }
  };

  return (
    <div className="statistics-container">
      <div className="card">
        <h2 className="card-title">Statistics - {selectedMonth} <select
          id="month"
          name="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">-- Select Month --</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select></h2>

        {statistics && (
        <div className="statistics-details">
          
          <p><strong>Total Sale Amount:</strong> ${statistics.totalSaleAmount.toFixed(2)}</p>
          <p><strong>Total Sold Items:</strong> {statistics.totalSoldItems}</p>
          <p><strong>Total Not Sold Items:</strong> {statistics.totalNotSoldItems}</p>
        </div>
      )}

      {error && <p className="error-message">Error: {error}</p>}
        
      </div>

      
    </div>
  );
};

export default Statistics;
