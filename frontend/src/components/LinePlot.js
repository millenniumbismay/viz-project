import React, { useState } from "react";
import { Line, XAxis, YAxis, Legend } from "react-chartjs-2";
import Chart from 'chart.js/auto';

// Takes in array of xvalues for xData
// array of arrays of yvalues for yData
// string for xAxisLabel
// array of strings for yLabelArr
const LinePlot = ({ xData, yDataArr, xAxisLabel, yLabelArr }) => {
  const [chartData, setChartData] = useState({
    labels: xData,
    datasets: Array.from({ length: yDataArr.length }, (_, i) => i).map(i => ({
      label: yLabelArr[i],
      data: yDataArr[i],
      fill: false
    }))
  });


  const options = {
    legend: {
      display: true,
    },
    scales: {
      xAxes: [{ display: true, scaleLabel: { display: true, labelString: xAxisLabel } }],
      yAxes: [{ display: true, scaleLabel: { display: true, labelString: "Test" } }],
    },
  };

  return (
    <Line data={chartData} options={options} />
  );
};

export default LinePlot;
