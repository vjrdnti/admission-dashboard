import React from 'react';

const CourseCard = ({ course, isInCart,isInPurchases, onAddToCart, onRemoveFromCart }) => {
  return (
    <div className="course-card">
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      {isInPurchases ? ( <button disabled>Course Already Bought</button> ) : ( isInCart ? (
        <button onClick={onRemoveFromCart}>Remove from Cart</button>
      ) : (
      <button onClick={onAddToCart}>Add to Cart</button>
        
      ))}
    </div>
  );
};

export default CourseCard;
