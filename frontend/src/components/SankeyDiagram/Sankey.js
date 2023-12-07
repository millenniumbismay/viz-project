import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Chart } from "react-google-charts";
import randomColor from '../../constants.js';
import Filter from '../Filter.js';

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
        <h2>Heterogeneous Sankey Diagram for the Flow Analysis of Visa Types to Sector to GDP</h2>
        <p>
          Heterogeneous Sankey Diagram is used to infer the flow
          of foreign work force to each economic sector, i.e. the Composition of foreign workers in
          each economic sector, and the flow of money from each sector to the GDP of the country,
          i.e. the contribution of each sector to the GDP. The heterogeneity of the Sankey Diagram
          provides a powerful visualization and narrates the story to its conclusion. 
        </p>
        <h4> Filter by Visa Type </h4>
        <p> To understand the proportion of workers in corresponding sectors and their final contribution to GDP</p>
        <h4> Filter by Sector </h4>
        <p> To understand the proportion of workers from different Visa Types in that sector and its final contribution to GDP</p>
      </div>
      <div className="chart-container">
        <div className="sankey-description">
          <div style={{flex: '1'}}>
            <p style={{ textAlign: 'center' }}>
              Composition of foreign workers in each sector
            </p>
          </div>
          <div style={{flex: '1'}}>
          <p style={{ textAlign: 'center' }}>
            Contribution of each sector to the GDP
          </p>
          </div>
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
