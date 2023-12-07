import React, { useState, useEffect } from "react";
import LinePlot from "./LinePlot";
import Filter from "../Filter";
import axios from 'axios';

// Takes in array of xvalues for xData
// array of arrays of yvalues for yData
// string for xAxisLabel
// string for yAxisLabel
// array of strings for yLabelArr (legend labels)
const LineChart = ({ xAxisLabel, yAxisLabel, filterNames, enumsArr }) => {
    const [filterStateArr, setFilterStateArr] = useState(Array.from({ length: filterNames.length }, (_, i) => []));

    const [chartData, setChartData] = useState(null);

    
    const modifyFilterStateArr = (i) => {
        return (newSelectedFilters) => {
            const newFilterStateArr = Array.from(filterStateArr);
            newFilterStateArr[i] = newSelectedFilters;
            setFilterStateArr(newFilterStateArr);
        };
    }
    
    useEffect(() => {
        axios.post('http://localhost:8000/api/lineplot', {
            "selectedFiltersArr": filterStateArr,
            "filterNames": filterNames,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => setChartData(res.data))
            .catch(error => console.error('Error:', error));
    }, [filterStateArr, filterNames]);

    const filterComponents = Array.from({ length: filterNames.length }, (_, i) =>
        <div className="filter" key={i}>
            <Filter key={i}
            filterName={filterNames[i]}
            enums={enumsArr[i]}
            selectedFilters={filterStateArr[i]}
            setSelectedFilters={modifyFilterStateArr(i)}/>
        </div>
    );







    return chartData ? (
        <div className="chart-root">
            <div className="chart-story">
                <h1>Line Chart</h1>
                <p>
                    This line chart shows the mean wage per year for a given set of filters.
                    The filters can be changed using the dropdown menus on the right.
                </p>
            </div>
            <div className="chart-container">
                <div className="chart">
                    <LinePlot data={chartData} xAxisLabel={xAxisLabel} yAxisLabel={yAxisLabel} />
                </div>
                <div className="filters">
                    {filterComponents}
                </div>
            </div>
        </div>
    ) : <p>Loading...</p>
};

export default LineChart;
