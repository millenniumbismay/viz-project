import React, { useRef, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const StackedBar = () => {
  const barOptions = {
    indexAxis: 'y',
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true
      }
    },
    plugins: {
      legend: {
        display: false
      }
    },
  }

  const data = {
    labels: ["2015", "2014", "2013", "2012", "2011"],

    datasets: [{
      data: [727, 589, 537, 543, 574],
      backgroundColor: "rgba(63,103,126,1)",
      hoverBackgroundColor: "rgba(50,90,100,1)"
    }, {
      data: [238, 553, 746, 884, 903],
      backgroundColor: "rgba(163,103,126,1)",
      hoverBackgroundColor: "rgba(140,85,100,1)"
    }, {
      data: [1238, 553, 746, 884, 903],
      backgroundColor: "rgba(63,203,226,1)",
      hoverBackgroundColor: "rgba(46,185,235,1)"
    }]
  }

  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    var myChart = new ChartJS(ctx, {
      type: 'bar', // change to the type of chart you want
      data: data, // add your data here
      options: barOptions // add your options here
    });
    return () => { myChart.destroy(); }
  }, [barOptions, data]);

  return (
  <div>
    <canvas ref={chartRef} />
  </div>
  );
}

export default StackedBar;

