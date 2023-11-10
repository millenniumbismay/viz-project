// src/Visualization.js
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);




const Visualization = () => {
  const [data, setData] = useState({
    labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
    datasets: [
      {
        label: 'Sample Data',
        data: [12, 19, 3, 5],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  const handleFilterChange = (event) => {
    // Update the data based on the selected filter
    const selectedFilter = event.target.value;
    // Modify the 'data' state based on the selected filter
    // You can add logic here to adjust the data as needed
  };

  return (
    <div>
      <Bar data={data} />
      <div>
        <div>
        <label htmlFor="filter">Select Filter: </label>
        <select id="filter" onChange={handleFilterChange}>
            <option value="filter1">Filter 1</option>
            <option value="filter2">Filter 2</option>
            <option value="filter3">Filter 3</option>
        </select>
        </div>
        <Bar data={data} />
        </div>
    </div>
  );
};

export default Visualization;