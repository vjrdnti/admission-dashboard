// src/components/UserInfo.js
import React, { useState, useEffect } from 'react';
import Posted from './Posted.js'

const UserInfo = ({ user }) => {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/college-posts');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
    
  }, []);
  
  return (
    <div>
      <h2>Welcome {user.name}</h2>
      <p>College: {user.college}</p>
      <p>Email: {user.email}</p>
	   <div className="posts">
            <Posted
              postedCourses={posts}
            />
        </div>
      {/* Add more user info as needed */}
    </div>
  );
};

export default UserInfo;

