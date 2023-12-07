import axios from 'axios';
import React, { useEffect, useState } from "react";
import Filter from "../Filter.js";
import LinePlot from "./LinePlot.js";

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
                <h2>Multi-line Charts for Mean Wage Correlation</h2>
                <p>
                    This visualization focuses on understanding the evolution of mean wage per year across different States, Visa Types,
                    and Economic Sectors over the period from 2010 - 2020. These filters are independent of each other.
                    The idea is to compare between the mean wage of multiple states, visa types or sectors.
                    Our visualization offers unique ability to compare between sectors and visa types and states.
                    This type of free interaction can help in analyzing the correlation between any two categories extensively.
                </p>
                <h4> Filter by State </h4>
                <p> To compare the mean wage across states</p>
                <h4> Filter by Visa </h4>
                <p> To compare the mean wage across different workers</p>
                <h4> Filter by Sector </h4>
                <p> To compare the mean wage across different Economic Sectors</p>
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
