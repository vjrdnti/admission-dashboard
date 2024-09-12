import React, { useState } from 'react';
import './Filters.css';

const Filters = ({ branches, districts, onApplyFilters, onResetFilters }) => {
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);

  const handleBranchChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedBranches(value);
  };

  const handleDistrictChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedDistricts(value);
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
        <label htmlFor="branches">Branches:</label>
        <select
          id="branches"
          multiple
          value={selectedBranches}
          onChange={handleBranchChange}
        >
          {branches.map((branch, index) => (
            <option key={index} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      </div>
      
      <div id="filtercontent">
        <label htmlFor="districts">Districts:</label>
        <select
          id="districts"
          multiple
          value={selectedDistricts}
          onChange={handleDistrictChange}
        >
          {districts.map((district, index) => (
            <option key={index} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <button onClick={handleApplyFilters}>Apply Filters</button>
        <button onClick={handleResetFilters}>Reset Filters</button>
      </div>
    </div>
  );
};

export default Filters;
