import React, { useState } from 'react';

// Data for provinces and districts
const provinceData = {
  Western: ['Colombo', 'Gampaha', 'Kalutara'],
  Central: ['Kandy', 'Matale', 'Nuwara Eliya'],
  // Add other provinces and their districts here
};

const App = () => {
  const [selectedProvince, setSelectedProvince] = useState('');
  const [districts, setDistricts] = useState([]);

  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setSelectedProvince(province);
    setDistricts(provinceData[province] || []);
  };

  return (
    <div style={{color: '#fff'}}>
      <h1>Select Province and District</h1>
      <div>
        <label htmlFor="province">Province:</label>
        <select id="province" value={selectedProvince} onChange={handleProvinceChange}>
          <option value="">--Select Province--</option>
          {Object.keys(provinceData).map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="district">District:</label>
        <select id="district">
          <option value="">--Select District--</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default App;
