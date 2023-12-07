import axios from 'axios';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useRef, useState } from 'react';
import Fade from 'react-bootstrap/Fade';
import seedrandom from 'seedrandom';
import randomColor from '../../constants.js';
import Filter from '../Filter';
import CustomSlider from './CustomSlider';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const createCountryLabels = (chart) => {
  var labels = [];
  for (let i = 0; i < chart?.data?.datasets?.length; i++) {
    // filter non-zero element indices from data
    let actualDataIndices = chart.data.datasets[i].data.
      map((x, idx) => x !== 0 ? idx : -1).filter((x) => x !== -1);
    let actualData = chart.data.datasets[i].data.filter((x) => x !== 0);
    let actualLabels = chart.data.datasets[i].label;
    for (let j = 0; j < actualData.length; j++) {
      let idx = actualDataIndices[j];
      labels.push({
        text: actualLabels[j],
        fillStyle: chart.data.datasets[i].backgroundColor[idx],
        strokeStyle: chart.data.datasets[i].borderColor[idx],
        lineWidth: 1,
        hidden: false,
        index: i
      });
    }
  }
  return labels;
}

const createVisaLabels = (chart) => {
  var labels = [];
  for (let i = 0; i < chart?.data?.datasets?.length; i++) {
    // filter non-zero elements from data
    let actualLabel = chart.data.datasets[i].label
    labels.push({
      text: actualLabel,
      fillStyle: chart.data.datasets[i].backgroundColor,
      strokeStyle: chart.data.datasets[i].borderColor,
      lineWidth: 1,
      hidden: false,
      index: i
    });
  }
  return labels;
}

const getHoverLabels = (ctx) => {
  let idx = 0;
  for (let i = 0; i < ctx.dataIndex; i++) {
    if (ctx.dataset.data[i] !== 0) ++idx;
  }
  if (ctx.dataset.label.length === 1) idx = 0;
  return ctx.dataset.label[idx] + " " + ctx.formattedValue;
}


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

const countryPostProcess = (data) => {
  seedrandom('h', { global: true });
  if (data == null) return;
  data.datasets.forEach(dataset => {
    dataset['backgroundColor'] = [];
    dataset['hoverBackgroundColor'] = [];
    dataset['borderColor'] = [];
    dataset.data.forEach(data => {
      let color = randomColor(75);
      dataset['backgroundColor'].push(color);
      dataset['hoverBackgroundColor'].push(color);
      dataset['borderColor'].push(color);
    })
  });
  return data;
}

const visaPostProcess = (data) => {
  seedrandom('m', { global: true });
  if (data == null) return;
  data.datasets.forEach(dataset => {
    let color = randomColor(75);
    dataset['backgroundColor'] = color;
    dataset['hoverBackgroundColor'] = color;
    dataset['borderColor'] = color;
  });
  return data;
}

const visaBarOptions = {
  indexAxis: 'y',
  scales: {
    x: {
      title: {
        display: true,
        text: 'Number of Foreign Workers',
      },
      stacked: true
    },
    y: {
      title: {
        display: true,
        text: 'Region / Continent',
      },
      stacked: true
    }
  },
  plugins: {
    legend: {
      maxWidth: 200,
      onClick: null,
      labels: {
        generateLabels: createVisaLabels
      },
      display: true,
      position: 'right',
      title: {
        text: 'Legend',
        display: true
      }
    }
  },
  animation: false
};

const countryBarOptions = {
  indexAxis: 'y',
  scales: {
    x: {
      title: {
        display: true,
        text: 'Number of Foreign Workers',
      },
      stacked: true
    },
    y: {
      title: {
        display: true,
        text: 'Region / Continent',
      },
      stacked: true
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: getHoverLabels,
      }
    },
    legend: {
      maxWidth: 200,
      onClick: null,
      labels: {
        generateLabels: createCountryLabels
      },
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


const StackedBar = () => {

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
  ];

  const allCountries = ['India', 'China - mainland', 'Japan', 'Korea, South', 'Philippines', 'Mexico', 'Jamaica', 'Guatemala', 'Canada', 'Costa Rica', 'Great Britain and Northern Ireland', 'Germany', 'France', 'Italy', 'Turkey', 'Brazil', 'Venezuela', 'Colombia', 'Argentina', 'Peru', 'Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Samoa', 'South Africa', 'Nigeria', 'Egypt', 'Kenya', 'Ghana'];

  const [data, setData] = useState(null);

  const [sliderValue, setSliderValue] = useState(2010);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedVisaTypes, setSelectedVisaTypes] = useState([]);
  const [filterCategory, setFilterCategory] = useState(false);

  const chartRef = useRef(null);

  useEffect(() => {
    if (filterCategory) countryPostProcess(data);
    else visaPostProcess(data);
    const ctx = chartRef?.current?.getContext('2d');
    if (filterCategory) {
      var myChart = new ChartJS(ctx, {
        type: 'bar', // change to the type of chart you want
        data: data, // add your data here
        options: countryBarOptions // add your options here
      });
    }
    else {
      var myChart = new ChartJS(ctx, {
        type: 'bar', // change to the type of chart you want
        data: data, // add your data here
        options: visaBarOptions // add your options here
      });
    }
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
        <h2>Time-Lapse of Number of workers from different Regions</h2>
        <p>
          This stacked bar chart shows the number of visas issued per year for every region.
        </p>
        <h4> View by Visa </h4>
        <p> To visualize the distribution of visa issues per region<br/>
        Filter on visa types to analyze specific visas</p>
        <h4> View by Country </h4>
        <p> To visualize the distribution of workers from certain country in a region<br/>
        Filter on Countries to analyze specific countries</p>
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
                <Filter filterName={"Filter by Country"} enums={allCountries} selectedFilters={selectedCountries} setSelectedFilters={setSelectedCountries} />
              </div>
            </Fade>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StackedBar;

