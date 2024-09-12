import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import UserInfo from './components/UserInfo';
import Filters from './components/Filters';
import CourseCard from './components/CourseCard';
import FixedBottom from './components/FixedBottom';
import './App.css';

const App = () => {
  const [user, setUser] = useState({ id: '', name: '', email: '', course: '', password: '', type: '' });
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({ branches: [], districts: [] });
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [cart, setCart] = useState([]);
  const [purchases, setPurchases] = useState([]);

  // Fetch user data first
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  // Fetch purchases after user is loaded
  useEffect(() => {
    if (user.id) {
      const fetchPurchases = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/purchases?userId=${user.id}`);
          const data = await response.json();
          setPurchases(data);
        } catch (error) {
          console.error('Error fetching purchases:', error);
        }
      };

      fetchPurchases();
    }
  }, [user.id]);

  // Fetch filters and courses when user.course is available
  useEffect(() => {
    if (user.course) {
      const fetchFilters = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/filters');
          const data = await response.json();
          setFilters(data);
        } catch (error) {
          console.error('Error fetching filters:', error);
        }
      };

      const fetchCourses = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/courses?degree=${user.course}`);
          const data = await response.json();
          setCourses(data);
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      };

      fetchFilters();
      fetchCourses();
    }
  }, [user.course]);

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cart');
        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, []);

  // Fetch filtered courses
  const fetchCourses = async (branches, districts, usercourse) => {
    try {
      const branchQuery = branches.join(',');
      const distQuery = districts.join(',');
      const response = await fetch(`http://localhost:5000/api/courses?degree=${usercourse}&branch=${branchQuery}&district=${distQuery}`);
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleApplyFilters = (branches, districts) => {
    setSelectedBranches(branches);
    setSelectedDistricts(districts);
    fetchCourses(branches, districts, user.course);
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

  const handleLogout = () => {
    localStorage.removeItem('user');  
    setCart([]); 
    window.location.href = '/';  
  };
  
  
  return (
    <div className="app">
      <Link to="/">
        <button className="logout" onClick={handleLogout}>Logout</button>
      </Link>

      <div className="row user-info">
        <UserInfo user={user} degree={user.course} />
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
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isInCart={cart.some(item => item.id === course.id)}
              isInPurchases={purchases.some(item => item.courseId === course.id)}
              onAddToCart={() => handleAddToCart(course)}
              onRemoveFromCart={() => handleRemoveFromCart(course.id)}
            />
          ))}
        </div>
      </div>

      <div className="fixed-bottom">
        <FixedBottom cartCount={cart.length} />
      </div>
    </div>
  );
};

export default App;
