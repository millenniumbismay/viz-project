import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import LineChart from './components/LineChart/LineChart';
import StackedBar from './components/StackedBarChart/StackedBar';
import Sankey from './components/SankeyDiagram/Sankey';
import { filterNames, sankeyFilters, sankeyEnumsArr, enumsArr } from './constants.js';
import { AppBar, Toolbar, Typography, Button, Box } from '@material-ui/core';

const active = {
  color: 'black',
  textDecoration: 'none',
};

const inactive = {
  textDecoration: 'none',
  backgroundColor: 'red',
};

const NavBar = ({ activeItem }) => (
  <AppBar position="static" className="appbar">
    <Typography align="center" className="project-title">Visualizing U.S. Immigration and Economy</Typography>
    <Toolbar variant="dense">
      <Box display="flex" justifyContent="center" width="100%">
        <Button color="inherit">
          <NavLink to="/linechart" style={isActive => isActive ? active : inactive}>Line Chart</NavLink>
        </Button>
        <Button color="inherit">
          <NavLink to="/stackedbar" style={isActive => isActive ? active : inactive}>Stacked Bar</NavLink>
        </Button>
        <Button color="inherit">
          <NavLink to="/sankey" style={isActive => isActive ? active : inactive}>Sankey</NavLink>
        </Button>
        {/* <Button color="inherit">
          <NavLink to="/fourth" activeStyle={activeStyle}>Fourth Component</NavLink>
        </Button> */}
      </Box>
    </Toolbar>
  </AppBar>
);

const App = () => {
  const [activeItem, setActiveItem] = useState(1);

  return (
    <Router>
      <NavBar activeItem={activeItem}/>
      <Routes>
        <Route path="/linechart" element={<LineChart filterNames={filterNames} enumsArr={enumsArr} xAxisLabel={"Year"} yAxisLabel="Mean Wage per Year" />} />
        <Route path="/stackedbar" element={<StackedBar />} />
        <Route path="/sankey" element={<Sankey filterNames={sankeyFilters} enumsArr={sankeyEnumsArr} />} />
        {/* <Route path="/fourth" element={<FourthComponent />} /> */}
      </Routes>
    </Router>
  );
};

export default App;