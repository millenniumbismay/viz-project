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
import CustomSlider from './CustomSlider';
import Filter from '../Filter';
import Fade from 'react-bootstrap/Fade';
import axios from 'axios';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const ViewByCountry = ({ filterCategory, setFilterCategory }) => {
  return (
    <button
      className={`view-filter btn ${!filterCategory ? 'btn-danger' : 'btn-primary'}`}
      onClick={() => { setFilterCategory(!filterCategory); }}>
      View by Country
    </button>
  );
}

const ViewByVisa = ({ filterCategory, setFilterCategory }) => {
  return (
    <button
      className={`view-filter btn ${filterCategory ? 'btn-danger' : 'btn-primary'}`}
      onClick={() => { setFilterCategory(!filterCategory); }}>
      View by Visa
    </button>
  );
}


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
    animation: false
  }

  const [data, setData] = useState(null);

  const [sliderValue, setSliderValue] = useState(2010);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedVisaTypes, setSelectedVisaTypes] = useState([]);
  const [filterCategory, setFilterCategory] = useState(true);

  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef?.current?.getContext('2d');
    var myChart = new ChartJS(ctx, {
      type: 'bar', // change to the type of chart you want
      data: data, // add your data here
      options: barOptions // add your options here
    });
    return () => { myChart.destroy(); }
  }, [data]);


  useEffect(() => {
    if (!filterCategory) setSelectedCountries([]);
    else setSelectedVisaTypes([]);
  }, [filterCategory]); // This will run whenever filterCategory changes

  useEffect(() => {
    axios.post('http://localhost:8000/api/stackedbar', {
      "year": sliderValue,
      "selectedCountries": selectedCountries,
      "selectedVisas": selectedVisaTypes,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => setData(res.data))
      .catch(error => console.error('Error:', error));
  }, [sliderValue, selectedCountries, selectedVisaTypes]);


  return (
    <div className="chart-container">
      <div className="chart">
        <canvas ref={chartRef} />
      </div>

      <CustomSlider min={2010} max={2022} sliderValue={sliderValue} setSliderValue={setSliderValue} />

      <div className='filters'>
        <div className='filter' style={{ display: 'flex', flexDirection: 'column' }}>
          <ViewByCountry filterCategory={filterCategory} setFilterCategory={setFilterCategory} />
          <Fade in={filterCategory}>
            <div>
              <Filter filterName={"Filter by Country"} enums={["India", "Germany", "Japan"]} selectedFilters={selectedCountries} setSelectedFilters={setSelectedCountries} />
            </div>
          </Fade>
        </div>
        <div className='filter' style={{ display: 'flex', flexDirection: 'column' }}>
          <ViewByVisa filterCategory={filterCategory} setFilterCategory={setFilterCategory} />
          <Fade in={!filterCategory}>
            <div>
              <Filter filterName={"Filter by Visa type"} enums={["H-1B", "H-2A", "H-2B"]} selectedFilters={selectedVisaTypes} setSelectedFilters={setSelectedVisaTypes} />
            </div>
          </Fade>
        </div>
      </div>
    </div>
  );
}

export default StackedBar;

