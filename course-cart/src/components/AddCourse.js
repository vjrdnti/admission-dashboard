import React, { useState } from 'react';

const AddCourse = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    branch: '',
    district: '',
    cost: '',
    intake: 0,
    cutoff: 0,
    count: 0
  });

  // form visibility ko toggle
  const handleButtonClick = () => {
    setShowForm(!showForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handler to submit the form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/add-course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    setFormData({
      title: '',
      description: '',
      branch: '',
      district: '',
      cost: '',
      intake: 0,
      cutoff: 0,
      count: 0
    });
    setShowForm(false);
    alert("course posted for verification");
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {!showForm ? (
        <button 
          onClick={handleButtonClick} 
          style={{
            width: '100px',
            height: '100px',
            backgroundColor: 'grey',
            color: 'white',
            fontSize: '24px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
          +
        </button>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        
          <label>Degree</label>
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />

          <label>Description</label>
          <input type="text" name="description" value={formData.description} onChange={handleInputChange} required />

          <label>Branch</label>
          <input type="text" name="branch" value={formData.branch} onChange={handleInputChange} required />

          <label>District</label>
          <input type="text" name="district" value={formData.district} onChange={handleInputChange} required />

          <label>Cost</label>
          <input type="number" name="cost" value={formData.cost} onChange={handleInputChange} required />
          
          <label>intake</label>
          <input type="number" name="intake" value={formData.intake} onChange={handleInputChange} required />
          
          <label>minimum cutoff</label>
          <input type="number" name="cutoff" value={formData.cutoff} onChange={handleInputChange} required />
          
          <button type="submit" style={{ marginTop: '10px', padding: '10px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Add Course
          </button>
        </form>
      )}
    </div>
  );
};

export default AddCourse;

