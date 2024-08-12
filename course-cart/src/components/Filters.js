import React, { useState } from 'react';

const Filters = ({ branches, districts, onApplyFilters, onResetFilters }) => {
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);

const handleBranchChange = (e) => {
  const value = e.target.value;
  setSelectedBranches((prevState) => {
    //if (Array.isArray(prevState)) {
      return prevState.includes(value)
        ? prevState.filter(branch => branch !== value)
        : [...prevState, value];
    //}
    //return [value]; // Initialize as an array if prevState is not an array
  });
};
  
  const handleDistrictChange = (e) => {
  const value = e.target.value;
  setSelectedDistricts((prevState) => {
    if (Array.isArray(prevState)) {
      return prevState.includes(value)
        ? prevState.filter(district => district !== value)
        : [...prevState, value];
    }
    return [value]; // Initialize as an array if prevState is not an array
  });
};


  const handleApplyFilters = () => {
    onApplyFilters(selectedBranches, selectedDistricts);
  };

  const handleResetFilters = () => {
    setSelectedBranches([]);
    setSelectedDistricts([]);
    onResetFilters();
  };

  return (
    <div className='filter'>
      
      <div id="filtercontent">
        <label>Branches:</label>
        <div>
          {branches.map((branch, index) => (
            <div key={index}>
              <input
                type="checkbox"
                value={branch}
                checked={selectedBranches.includes(branch)}
                onChange={handleBranchChange}
              />
              <label>{branch}</label>
            </div>
          ))}
        </div>
      </div>
      <br></br><br></br>
       <div>
        <label>Districts:</label>
        {districts.map((district, index) => (
          <div key={index}>
            <input
              type="checkbox"
              value={district}
              checked={selectedDistricts.includes(district)}
              onChange={handleDistrictChange}
            />
            {district}
        </div>
        ))}
        <br></br><br></br>
     <div id="fixedfilter">
     <button onClick={handleApplyFilters}>Apply Filters</button>
     <span>  </span>
     <button onClick={handleResetFilters}>Reset Filters</button>
     </div>
    </div>
      
    </div>
  );
};

export default Filters;

