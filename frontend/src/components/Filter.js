import React from "react";

const Filter = ({ filterName, enums, selectedFilters, setSelectedFilters }) => {
  // selectedFilters is a set of the selected filters
  // since we want to allow multiple filters to be selected at once
  // we use a set instead of a single value, which makes it easier to add/remove values

  // handleChange is called whenever a checkbox is clicked
  // it updates the selectedFilters set
  const handleChange = (event) => {
    const value = event.target.name;
    const newSelectedFilters = Array.from(selectedFilters);
    const index = selectedFilters.indexOf(value);
    if (index > -1) {
      newSelectedFilters.splice(index, 1);
    } else {
      newSelectedFilters.push(value);
    }
    setSelectedFilters(newSelectedFilters);
  };

  return (
    <div className="d-inline-block">
      <div className="p-3 mb-2 bg-primary text-white rounded text-center">{filterName}</div>
      <div className="border p-3">
        {enums.map((value) => (
          <div key={value} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name={value}
              id={value}
              checked={selectedFilters.includes(value)}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor={value}>
              {value}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;