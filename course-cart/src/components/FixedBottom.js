import React from 'react';
import { Link } from "react-router-dom";

const FixedBottom = ({ cartCount }) => {
  return (
    <div className="fixed-bottom">
    <Link to="/billing">
      <button className="go-to-cart">
        Go to Cart ({cartCount})
      </button></Link>
    </div>
  );
};

export default FixedBottom;

