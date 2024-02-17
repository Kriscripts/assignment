import React from 'react';
import Statistics from './components/Statistics';
import TransactionsTable from './components/TransactionTable';
import BarChart from './components/BarChart';

function App() {
  return (
    <div className="App">
     
      <TransactionsTable/>
      <Statistics />
      <BarChart/>
    </div>
  );
}

export default App;
