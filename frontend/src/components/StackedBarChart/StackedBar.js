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
import randomColor from '../../constants.js';
import seedrandom from 'seedrandom';


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

const postProcess = (data) => {
  seedrandom('hello.', { global: true });
  if (data == null) return;
  data.datasets.forEach(dataset => {
    let color = randomColor(75);
    dataset['backgroundColor'] = color;
    dataset['hoverBackgroundColor'] = color;
    dataset['borderColor'] = color;
  });
  return data;
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
        display: true,
        position: 'right',
        title: {
          text: 'Legend',
          display: true
        }
      }
    },
    animation: false
  }

  const visaTypes = [
    "H-1B",
    "H-2A",
    "H-4",
    "H-2B",
    "E-2",
    "O-1",
    "E-1",
    "O-2",
    "E-3",
    "O-3",
    "E-3D",
    "H-3",
    "E-3R",
    "H-1B1",
    "E-2C",
    "H-1C",
    "H-1A"
]

  const [data, setData] = useState(null);

  const [sliderValue, setSliderValue] = useState(2010);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedVisaTypes, setSelectedVisaTypes] = useState([]);
  const [filterCategory, setFilterCategory] = useState(false);

  const chartRef = useRef(null);

  useEffect(() => {
    postProcess(data);
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
      "filterCategory": filterCategory ? "country" : "visa"
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => setData(res.data))
      .catch(error => console.error('Error:', error));
  }, [sliderValue, filterCategory, selectedCountries, selectedVisaTypes]);


  return (
    <div className="chart-root">
      <div className="chart-story">
        <h1>Stacked Bar Chart</h1>
        <p>
          This stacked bar chart shows the number of visas issued per year for a given set of filters.
          The filters can be changed using the dropdown menus on the right.
        </p>
      </div>
      <div className="chart-container">
        <div className="chart">
          <canvas ref={chartRef} />
        </div>

        <CustomSlider min={2010} max={2020} sliderValue={sliderValue} setSliderValue={setSliderValue} />

        <div className='filters'>
        <div className='filter' style={{ display: 'flex', flexDirection: 'column' }}>
            <ViewByVisa filterCategory={filterCategory} setFilterCategory={setFilterCategory} />
            <Fade in={!filterCategory}>
              <div>
                <Filter filterName={"Filter by Visa type"} enums={visaTypes} selectedFilters={selectedVisaTypes} setSelectedFilters={setSelectedVisaTypes} />
              </div>
            </Fade>
          </div>
          <div className='filter' style={{ display: 'flex', flexDirection: 'column' }}>
            <ViewByCountry filterCategory={filterCategory} setFilterCategory={setFilterCategory} />
            <Fade in={filterCategory}>
              <div>
                <Filter filterName={"Filter by Country"} enums={["India", "Germany", "Japan"]} selectedFilters={selectedCountries} setSelectedFilters={setSelectedCountries} />
              </div>
            </Fade>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StackedBar;

