import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import './BarChart.css'; 
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const BarChart = () => {
  const [months] = useState([
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]);
  const [apiData, setApiData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('June');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/bar-chart?month=${selectedMonth}`);
        const data = await response.json();
        console.log('API Response:', data);
        setApiData(data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
        console.log('Actual API response:', error.response);
      }
    };

    fetchData();
  }, [selectedMonth]);


  return (
    <div className="bar-chart-container">
        <div className="card">
      <h2 className="card-title">Bar Chart Stats - {selectedMonth} 
        <select
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
        </select>
      </h2>
      {apiData && apiData.success ? (
        <div>
          <Bar
            data={{
              labels: apiData.data.barChartData.map(entry => entry.range),
              datasets: [
                {
                  label: 'Product Count',
                  data: apiData.data.barChartData.map(entry => entry.count),
                  backgroundColor: 'rgba(75,192,192,0.2)',
                  borderColor: 'rgba(75,192,192,1)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              scales: {
                x: {
                  type: 'category',
                  title: {
                    display: true,
                    text: 'Price Range',
                  },
                },
                y: {
                  beginAtZero: true,
                  suggestedMin: 0, 
                  suggestedMax: 80, 
                  title: {
                    display: true,
                    text: 'Product Count',
                  },
                  stepSize: 20,
                },
              },
             
             
            }}
          />
        </div>
      ) : (
        <p>Error fetching data or data format is incorrect.</p>
      )}
    </div>
    </div>
  );
};

export default BarChart;
