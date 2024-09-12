import React from 'react';
import './CourseCard.css';

const CourseCard = ({ course, isInCart, isInPurchases, onAddToCart, onRemoveFromCart }) => {
  return (
    <div className="course-card">
      <h3>{course.title}</h3>
      <p>{course.branch}</p>
      <p>{course.description}</p>

      {/* Show "Course Already Bought" if the user already purchased it */}
      {isInPurchases ? (
        <button disabled>Course Already Bought</button>
      ) : (
        isInCart ? (
          <button onClick={onRemoveFromCart}>Remove from Cart</button>
        ) : (
          <button onClick={onAddToCart}>Add to Cart</button>
        )
      )}
      
      <p>Intake: {course.intake}</p>
      <p>Forms purchased: {course.count}</p>
    </div>
  );
};

export default CourseCard;
