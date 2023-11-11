import React, { useEffect, useState } from 'react';
import Filter from '../Filter';
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

  const options = {};

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
    <div className="chart-container">
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
  );
}

export default Sankey;
