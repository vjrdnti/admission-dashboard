import React, { useEffect, useState } from 'react';
import '../app4.css';

const CourseList = ({ status }) => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/courses-admin')
            .then(res => res.json())
            .then(data => setCourses(data))
            .catch(err => console.error(err));
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const updatedCourses = courses.map(course => ({
            ...course,
            status: formData.get(`status-${course.id}`),
        }));
        alert('do you want to continue?');
        fetch('http://localhost:5000/api/courses-admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCourses),
        })
        .then(res => res.text())
        .then(data => {
            setCourses(updatedCourses);
            alert(data);
        })
        .catch(err => console.error(err));
    };

    return (
    <div className='appp'>
        <form onSubmit={handleSubmit} className="f1">
          <div className='content'>
          <div className = 'left-columnn'>
        	<h3>{ status }<br></br></h3>
            {courses.map(course => course.status===status && (
                <div key={course.id} className="course-card">
                    <p><b>{course.title}</b></p><br></br>
                    <p><b>{course.branch}</b></p><br></br>
                    <p><b>{course.college}</b></p><br></br>
                    <p>{course.description}</p>
                    <label>
                        <input
                            type="radio"
                            name={`status-${course.id}`}
                            value="verified"
                            defaultChecked={course.status === 'verified'}
                        />
                        Verified
                    </label>
                    <label>
                        <input
                            type="radio"
                            name={`status-${course.id}`}
                            value="unverified"
                            defaultChecked={course.status === 'unverified'}
                        />
                        Unverified
                    </label>
                </div>
            ))}
            </div>
            <div className = 'right-columnn'>
            <h3>un{ status }<br></br></h3>
            {courses.map(course => course.status!==status && (
                <div key={course.id} className="course-card">
                    <p><b>{course.title}</b></p><br></br>
                    <p><b>{course.branch}</b></p><br></br>
                    <p><b>{course.college}</b></p><br></br>
                    <p>{course.description}</p>
                    <label>
                        <input
                            type="radio"
                            name={`status-${course.id}`}
                            value="verified"
                            defaultChecked={course.status === 'verified'}
                        />
                        Verified
                    </label>
                    <label>
                        <input
                            type="radio"
                            name={`status-${course.id}`}
                            value="unverified"
                            defaultChecked={course.status === 'unverified'}
                        />
                        Unverified
                    </label>
                </div>
            ))}
            </div>
        </div>
        <button type="submit" id="fixed">Submit</button>
        </form>
        </div>
    );
};

export default CourseList;

