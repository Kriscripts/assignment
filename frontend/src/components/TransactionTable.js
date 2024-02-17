import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TransactionsTable.css';

function TransactionsTable() {
  const [transactions, setTransactions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('June');
  const [currentPage, setCurrentPage] = useState(1);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
   
    fetchData(selectedMonth);
    setCurrentPage(1); 
  }, [selectedMonth]);

  const fetchData = async (month) => {
    try {
      const response = await axios.get(`http://localhost:3000/transactions?month=${month}`);
      setTransactions(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setCurrentPage(1);
  };


  const handlePageChange = async (newPage) => {
    try {
      setCurrentPage(newPage);
      const response = await axios.get(`http://localhost:3000/transactions?month=${selectedMonth}&page=${newPage}`);
      setTransactions(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };
  


  return (
    <div className="transactions-container">
        
         <div className="card">
        
      <h2 className="card-title">Transactions - {selectedMonth} <select
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
        <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search Transaction" />
        </h2>

      <table className="transactions-table">
        
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>
        </thead>
       
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{transaction.category}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
              <td>
                {transaction.image && (
                  <img src={transaction.image} alt="Product" className="product-image" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
      <div className="pagination">
         <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
      </div>
    </div>
    </div>
  );
}

export default TransactionsTable;