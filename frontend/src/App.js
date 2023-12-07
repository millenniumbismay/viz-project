import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LineChart from './components/LineChart/LineChart';
import Sankey from './components/SankeyDiagram/Sankey';
import StackedBar from './components/StackedBarChart/StackedBar';
import NavBar from './components/NavBar';
import { enumsArr, filterNames, sankeyEnumsArr, sankeyFilters } from './constants';
import seedrandom from 'seedrandom';

seedrandom('hello.', { global: true });

const App = () => { 
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
  );
};

export default App;