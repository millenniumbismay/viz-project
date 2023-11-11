import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LineChart from './components/LineChart/LineChart';
import StackedBar from './components/StackedBarChart/StackedBar';
import Sankey from './components/SankeyDiagram/Sankey';

const NavBar = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-info">
    <div>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/linechart">Line Chart</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/stackedbar">Stacked Bar</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/sankey">Sankey</Link>
          </li>
          {/* <li className="nav-item">
            <Link className="nav-link" to="/fourth">Fourth Component</Link>
          </li> */}
        </ul>
      </div>
    </div>
  </nav>
);

const App = () => {
  const filterNames = ["State", "Visa", "Sector"];
  const enumsArr = [["Arizona", "Arkansas", "Texas"], ["H-1B", "H-2A", "H-2B"], ["Utilities", "Mining", "Construction"]];

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/linechart" element={<LineChart filterNames={filterNames} enumsArr={enumsArr} />} />
        <Route path="/stackedbar" element={<StackedBar />} />
        <Route path="/sankey" element={<Sankey filterNames={filterNames} enumsArr={enumsArr} />} />
        {/* <Route path="/fourth" element={<FourthComponent />} /> */}
      </Routes>
    </Router>
  );
};

export default App;