import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import UserInfo from './components/UserInfo';
import Filters from './components/Filters';
import CourseCard from './components/CourseCard';
import BillingPage from './components/BillingPage';
import FixedBottom from './components/FixedBottom';
//import LoginModal from './components/LoginModal';
import './App.css';

const App = () => {
  const [user, setUser] = useState({'id': '', 'name': '', 'email': '', 'course': '','password': '', 'type': ''});
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
        console.log(data);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    const fetchFilters = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/filters');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setFilters(data);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    
    const fetchCoursesi = async (usercourse) => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses?degree=${usercourse}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };
  
   const fetchCart = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cart');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
    
    const fetchPurchases = async (userid) => {
      try {
        const response = await fetch('http://localhost:5000/api/purchases');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setPurchases(data);
      } catch (error) {
        console.error('Error fetching purcchases:', error);
      }
    };

    fetchUser();
    fetchFilters();
    fetchCoursesi(user.course);
    fetchCart();
    fetchPurchases(user.id);
    
  }, [user.course, user.id]);
  
   const fetchCourses = async (branches, districts, usercourse) => {
    try {
      const branchQuery = branches.join(',');
      const distQuery = districts.join(',');
      const response = await fetch(`http://localhost:5000/api/courses?degree=${user.course}&branch=${branchQuery}&district=${distQuery}`);
      //console.log(branchQuery);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleApplyFilters = (branches, districts, degree) => {
    setSelectedBranches(branches);
    setSelectedDistricts(districts);
    fetchCourses(branches, districts, degree);
  };

  const handleResetFilters = () => {
    setSelectedBranches([]);
    setSelectedDistricts([]);
    fetchCourses([], [], user.course);
  };
  
  const handleAddToCart = async (course) => {
    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ course }),
      });
      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  
  const handleRemoveFromCart = async (courseId) => {
    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });
      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const handleBuyNow = () => {
    alert('Purchase successful!');
    setCart([]); // Clear the cart after purchase
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
    <Link to="/">
      <button className="logout">
        logout
      </button></Link>	
      <div className="row user-info">
        <UserInfo user={user} 
        degree={user.course}
        />
      </div>
      <div className="row main-content">
        <div className="filters">
        <h3 id='fixedheading'>Apply Filters</h3>
          <Filters
            branches={filters.branches}
            districts={filters.districts}
            degree={user.course}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />
        </div>
        
        <div className="courses">
          {courses.map((course, index) => (
            <CourseCard
              key={index}
              course={course}
              isInCart={cart.some(item => item.id === course.id)}
              isInPurchases={purchases.some(item => item.user.id === user.id && item.course.id === course.id)}
              onBuyNow={() => console.log('Buying:', course)}
              onAddToCart={() => handleAddToCart(course)}
              onRemoveFromCart={() => handleRemoveFromCart(course.id)}
            />
          ))}
        </div>
        
      </div>
      <div className="fixed-bottom">
        <FixedBottom cartCount={cart.length}/>
      </div>
   </div> 
  );
};

export default App;

