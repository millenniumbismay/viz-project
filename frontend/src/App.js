import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LineChart from './components/LineChart/LineChart.js';
import Sankey from './components/SankeyDiagram/Sankey.js';
import StackedBar from './components/StackedBarChart/StackedBar.js';
import NavBar from './components/NavBar.js';
import { enumsArr, filterNames, sankeyEnumsArr, sankeyFilters } from './constants.js';
import seedrandom from 'seedrandom';
import RadioFilter from './components/RadioFilter.js';
import { useState } from 'react';

seedrandom('hello.', { global: true });

const App = () => { 
  const [a, setA] = useState([]);
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/stackedbar" element={<StackedBar />} />
        <Route path="/linechart" element={<LineChart filterNames={filterNames} enumsArr={enumsArr} xAxisLabel={"Year"} yAxisLabel="Mean Wage per Year" />} />
        <Route path="/sankey" element={<Sankey filterNames={sankeyFilters} enumsArr={sankeyEnumsArr} />} />
        {/* <Route path="/fourth" element={<FourthComponent />} /> */}
      </Routes>
    </Router>
    // <RadioFilter filterName="test" enums={["t1", "t2", "t3"]} selectedFilters={a} setSelectedFilters={setA} />
  );
};

export default App;