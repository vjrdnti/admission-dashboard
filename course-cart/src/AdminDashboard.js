// src/AdminDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './app3.css';
import CourseList from './components/CourseList';
import UserInfo from './components/purchased-admin';
import VerificationButton from './components/VerificationButton'; // Import the new component

const AdminDashboard = () => {
  const [user, setUser] = React.useState(null);
  const [purchases, setPurchases] = React.useState([]);

  React.useEffect(() => {
    // Fetch user and purchases only
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    const fetchPurchases = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/purchases-admin');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setPurchases(data);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      }
    };

    fetchUser();
    fetchPurchases();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <header>
        <h1>Admin Dashboard</h1>
        <Link to="/">
          <button className="logout">Logout</button>
        </Link>
      </header>
      <div className="content">
        <div className="left-column">
          <UserInfo boughtCourses={purchases} />
        </div>
        <div className="right-column">
          <CourseList status='verified' />
        </div>
        <div className="verification-container">
          <Link to="/students">
            <VerificationButton />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
