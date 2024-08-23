import React, { useState } from 'react';
import '../purchasespopup.css'

const UserInfo = ({ boughtCourses }) => {
  
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  
  return (
    <div>
      <button className="open-modal-btn" onClick={openModal}>
        View Your Purchases
      </button>

      {showModal && (
        <div className="modal-overlay">
        <div className="modal-content">
		<div className="purchases">
		<h2>Your Purchases</h2>
          {boughtCourses.map((purchase, index) => (
          <div>
            <p><b><i>Purchase {index+1}</i></b></p>
            <p><i>Course ID: {purchase.course.id}</i></p>
            <p><i>Course: {purchase.course.title}</i></p>
            <p><i>Branch: {purchase.course.branch}</i></p>
            <p><i>Invoice: {purchase.invoice}</i></p>
          </div>
          ))}
        </div>
		<button className="close-modal-btn" onClick={closeModal}>
		Close
        </button>
        </div>
       </div>
      )}
    </div>
  );
};

export default UserInfo;

