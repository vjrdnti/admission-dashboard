import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './app3.css';
import CourseList from './components/CourseList';
import UserInfo from './components/purchased-admin';
import VerificationButton from './components/VerificationButton';

const AdminDashboard = () => {
  const [user, setUser] = useState({'id': '', 'name': '', 'email': '', 'password': '', 'type': ''});
  const [purchases, setpurchases] = useState([]);

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
    
    const fetchPurchases = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/purchases-admin');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        //console.log(data);
        setpurchases(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    
    fetchUser();
    fetchPurchases();
  }, [] );
  
  
    if(!user){
  	return <div>no user</div>;
  	console.log('NO USER AAAAAAAH');
	}
	if(user.type !== "admin"){
	  return <div>{user.type}</div>;
	}

  return (
    <div className="app">
      <header>
            <h1>Admin Dasshboard</h1>
            <Link to="/">
		  <button className="logout">
			logout
		  </button></Link>	
        </header>
        <div className="content">
            <div className="left-column">
               <UserInfo boughtCourses={ purchases }/>
            </div>
            <div className="right-column">
                <CourseList status='verified'/>
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

