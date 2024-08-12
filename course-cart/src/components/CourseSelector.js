import React, { useState, useEffect } from 'react';

const CourseSelector = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {

    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/college-posts');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleSelect = (courseId) => {
    setSelectedCourses(prevSelected =>
      prevSelected.includes(courseId)
        ? prevSelected.filter(id => id !== courseId)
        : [...prevSelected, courseId]
    );
  };

  const handleRemove = async () => {
    const updatedCourses = courses.filter(course => !selectedCourses.includes(course.id));
    setCourses(updatedCourses);

    //const payload = { updatedCourses };

    try {
      const response = await fetch('http://localhost:5000/api/college-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updatedCourses }),
      });
      
     const data = await response.json();
     return data;


      if (!response.ok) {
        throw new Error('Error updating courses');
      }

      console.log('Courses updated successfully');
    } catch (error) {
      console.error('Error updating courses:', error);
    }

    setSelectedCourses([]);
  };

  return (
    <div>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            <input
              type="checkbox"
              checked={selectedCourses.includes(course.id)}
              onChange={() => handleSelect(course.id)}
            />
            {course.title} {course.branch} {course.id} <i>status: {course.status} </i> 
          </li>
        ))}
      </ul>
      <button onClick={handleRemove} disabled={selectedCourses.length === 0}>
        Remove Selected Courses
      </button>
    </div>
  );
};

export default CourseSelector;
