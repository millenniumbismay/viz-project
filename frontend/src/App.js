// App.jsx
import React, { useEffect, useState } from "react";
import LineChart from "./components/LineChart/LineChart";
import StackedBar from "./components/StackedBarChart/StackedBar";

const App = () => {

  return (
    <LineChart xAxisLabel="Year" yAxisLabel="Wage"
    filterNames={["State", "Visa", "Sector"]}
    enumsArr={[["Arizona", "Arkansas", "Texas"], ["H-1B", "H-2A", "H-2B"], ["Utilities", "Mining", "Construction"]]}
    />
  );
};

export default App;
