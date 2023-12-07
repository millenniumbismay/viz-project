import React from "react";
import { Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import randomColor from '../../constants.js';

// Takes in array of xvalues for xData
// array of arrays of yvalues for yData
// string for xAxisLabel
// string for yAxisLabel
// array of strings for yLabelArr (legend labels)

const LinePlot = ({ xAxisLabel, yAxisLabel, data }) => {

  const options = {
    legend: {
      display: true,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xAxisLabel
        }
      },
      y: {
        title: {
          display: true,
          text: yAxisLabel
        }
      }
    },
  };

  data.datasets.forEach(dataset => {
    dataset['borderColor'] = randomColor(75);
  });

  return (
    <Line data={data} options={options} />
  );
};

export default LinePlot;
