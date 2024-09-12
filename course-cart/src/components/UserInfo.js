// src/components/UserInfo.js
import React, { useState, useEffect } from 'react';
import Purchased from './Purchased.js';
import './UserInfo.css';

const UserInfo = () => {
  const [user, setUser] = useState({});
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    // Fetch user from localStorage
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
    
    const fetchPurchases = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/purchases');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setPurchases(data);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      }
    };
    fetchPurchases();
  }, []);

  return (
    <div>
      {user && (
        <>
          <h2>Welcome {user.name}</h2>
          <p>Degree: {user.course}</p>
          <p>Email: {user.email}</p>
        </>
      )}
      <div>
        <Purchased boughtCourses={purchases} />
      </div>
    </div>
  );
};

export default UserInfo;
