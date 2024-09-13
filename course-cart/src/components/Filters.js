import React, { useState } from 'react';
import './Filters.css';

const Filters = ({ branches, districts, onApplyFilters, onResetFilters }) => {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const handleApplyFilters = () => {
    onApplyFilters([selectedBranch], [selectedDistrict]);
  };

  const handleResetFilters = () => {
    setSelectedBranch('');
    setSelectedDistrict('');
    onResetFilters();
  };

  return (
    <div className="filter">
      <div id="filtercontent">
        <label htmlFor="branches">Branches:</label>
        <select
          id="branches"
          value={selectedBranch}
          onChange={handleBranchChange}
        >
          <option value="">Select Branch</option>
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
          value={selectedDistrict}
          onChange={handleDistrictChange}
        >
          <option value="">Select District</option>
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
