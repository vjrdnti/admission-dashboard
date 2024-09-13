import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import CollegeInfo from './components/CollegeInfo';
//import LoginModal from './components/LoginModal';
import AddCourse from './components/AddCourse';
import CourseSelector from './components/CourseSelector';
import './App2.css';

const App = () => {
  const [user, setUser] = useState({'id': '', 'name': '', 'email': '', 'college': '','password': '', 'type': ''});
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({ branches: [], districts: [] });
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [cart, setCart] = useState([]);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        //console.log(data);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    
    fetchUser();
    
  }, [] );

  const handleLogout = async () => {
    const response = await fetch('http://localhost:5000/api/logout', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      const updatedCart = await response.json();
      setCart(updatedCart); 
  };


  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
    <Link to="/">
      <button className="logout" onClick={handleLogout}>
        logout
      </button></Link>	
      <div className="row user-info">
        <CollegeInfo user={user} 
        />
      </div>
      
      <div className="row main-content c">
        <div className="addcourse">
        <h3>Add Course</h3>
          <AddCourse />
        </div>
        <div className="removecourse">
        <h3>remove Course</h3>
          <CourseSelector />
        </div>
      </div>
   </div> 
  );
};

export default App;

