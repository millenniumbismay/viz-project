import React, { useEffect, useState } from 'react';
import Filter from '../Filter';
import randomColor from '../../constants.js'
import { Chart } from "react-google-charts";
import axios from 'axios';

const Sankey = ({ filterNames, enumsArr }) => {
  const [filterStateArr, setFilterStateArr] = useState(Array.from({ length: filterNames.length }, (_, i) => []));
  // const data = [
  //   ["From", "To", "Weight"],
  //   ["A", "X", 5],
  //   ["A", "Y", 7],
  //   ["A", "Z", 6],
  //   ["B", "X", 2],
  //   ["B", "Y", 9],
  //   ["B", "Z", 4],
  // ];
  const [data, setData] = useState(null);

  var colors = Array.from({ length: 10 }, (_, i) => randomColor(75));

  var options = {
    height: 400,
    sankey: {
      node: {
        colors: colors
      },
      link: {
        colorMode: 'gradient',
        colors: colors
      }
    }
  };

  useEffect(() => {
    axios.post('http://localhost:8000/api/sankey', {
      "selectedFiltersArr": filterStateArr,
      "filterNames": filterNames,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => setData(res.data))
      .catch(error => console.error('Error:', error));
  }, [filterStateArr, filterNames]);



  const modifyFilterStateArr = (i) => {
    return (newSelectedFilters) => {
      const newFilterStateArr = Array.from(filterStateArr);
      newFilterStateArr[i] = newSelectedFilters;
      setFilterStateArr(newFilterStateArr);
    };
  }

  const filterComponents = Array.from({ length: filterNames.length }, (_, i) =>
    <div className="filter" key={i}>
      <Filter key={i}
        filterName={filterNames[i]}
        enums={enumsArr[i]}
        selectedFilters={filterStateArr[i]}
        setSelectedFilters={modifyFilterStateArr(i)} />
    </div>
  );

  return (
    <div className="chart-root">
      <div className="chart-story">
        <h1>Sankey Diagram</h1>
        <p>Sankey diagrams are a type of flow diagram in which the width of the arrows is proportional to the flow rate.</p>
      </div>
      <div className="chart-container">
        <div className="sankey-description">
          <p style={{ textAlign: 'left' }}>
            Composition of foreign workers in each sector
          </p>
          <p style={{ textAlign: 'right' }}>
            Contribution of each sector to the GDP
          </p>
        </div>
        <div className="chart" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Chart
            chartType="Sankey"
            width="1000px"
            height="400px"
            data={data}
            options={options}
          />
        </div>
        <div className="filters">
          {filterComponents}
        </div>
      </div>
    </div>
  );
}

export default Sankey;
