import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../billing.css';

const BillingPage = () => {
  const [cart, setCart] = useState([]);
  const totalCost = cart.reduce((total, course) => total + course.cost, 0);
  const platformFee = 50;
  const gst = (12/100)*totalCost;
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
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
    fetchCart();  
  });
  
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

  function handleBuyNow(cart) {
  	var invtotal = totalCost + platformFee + gst;
  	var num_c = cart.length - 1;
  	if(num_c==0){ var invoice = 'paid '+ invtotal + ' for this course '+' on XX/XX/XX'; }
  	else if(num_c===1){
    	var invoice = 'paid '+ invtotal + ' for this course and ' + num_c +' other on XX/XX/XX';
    }
    else{
    	var invoice = 'paid '+ invtotal + ' for this course and ' + num_c +' others on XX/XX/XX';
    }
    
  	fetch('http://localhost:5000/api/purchasesp', {
  	method: 'POST',
  	headers: {
  	  'Content-Type' : 'application/json',
  	},
  	body: JSON.stringify({ invoice }),
  	});
    alert('Purchase successful!');
    setCart([]); // Clear the cart after purchase
  }
  
  const handleBreakdown = () => {
    setShowBreakdown(!showBreakdown);
  };
  
  return (
    <div className="billing-page">
      <h2 className="billing-page-title">Your Cart</h2>
      <div className="cart-items">
        {cart.length > 0 ? (
          cart.map((course) => (
            <div key={course.id} className="cart-item">
              <span className="cart-item-title">{course.title}</span>
              <span className="cart-item-id">Course ID: {course.id}</span>
              <span className="cart-item-cost">{course.cost} Rs</span>
              <button className="remove-btn" onClick={() => handleRemoveFromCart(course.id)}>Remove</button>
            </div>
          ))
        ) : (
          <p className="empty-cart-message">Your cart is empty</p>
        )}
      </div>
      <div className="billing-summary">
        <h3 className="total-cost">Total: {totalCost+platformFee+gst} Rs</h3>
        <button className="breakdown-btn" onClick={handleBreakdown} disabled={cart.length === 0}>
          Detailed Bill
        </button>
        <button className="buy-now-btn" onClick={() => handleBuyNow(cart)} disabled={cart.length === 0}>
          Buy Now
        </button>
        <Link to="/dashboard">
          <button className="go-to-dashboard">
            Back to Dashboard
          </button>
        </Link>
      </div>
      
      {showBreakdown && (
        <div className="breakdown-popup">
          <div className="breakdown-content">
            <h3>Cost Breakdown</h3>
            <p>Total Cost: {totalCost} Rs</p>
            <p>Platform Fee: {platformFee} Rs</p>
            <p>Tax: {gst.toFixed(2)} Rs</p>
            <button className="close-popup-btn" onClick={handleBreakdown}>Close</button>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default BillingPage;

