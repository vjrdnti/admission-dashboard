// src/components/StudentTable.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './StudentsTable.css'


const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const location = useLocation();

useEffect(() => {
  
  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/students');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };
  
    fetchStudents();
  }, []);


  const handleDeleteStudent = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/${studentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setStudents(students.filter(student => student.id !== studentId));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };


  return (
    <div className="app">
      <header>
        <h1>Student Table</h1>
      </header>
      <div className="content">
        <table className="students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Percentile</th>
              <th>Marksheets</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>
                <td>{student.percentile}</td>
                <td>
                  {student.marksheet && (
                    <a href={`http://localhost:5000/uploads/${student.marksheet}`} target="_blank" rel="noopener noreferrer">
                      View Marksheets
                    </a>
                  )}
                </td>
                <td>
                  <button onClick={() => handleDeleteStudent(student.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <div className="verification-container">
          <Link to="/admin-dashboard">
             <button className="verification-button">
			  back
			</button>
          </Link>
          </div>
    </div>
  );
};

export default StudentTable;
