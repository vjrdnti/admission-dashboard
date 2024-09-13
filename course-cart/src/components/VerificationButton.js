import React from 'react';
import './Verification.css'; // Import CSS file for styling

const VerificationButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="verification-button">
      Verification
    </button>
  );
};

export default VerificationButton;
