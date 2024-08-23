import React, { useState } from 'react';
import '../purchases.css'

const UserInfo = ({ boughtCourses }) => {
  
  const [showModal, setShowModal] = useState(true);
  const openModal = () => setShowModal(true);
  //const closeModal = () => setShowModal(false);
  
  return (
    <div>
        
        <div className="modal-content">
		<div className="purchases">
		<h2>All Purchases</h2>
          {boughtCourses.map((purchase, index) => (
          <div>
          	<p><b>User ID: {purchase.user.id}</b></p>
            <p><b><i>Purchase {index+1}</i></b></p>
            <p><i>Course ID: {purchase.course.id}</i></p>
            <p><i>Course: {purchase.course.title}</i></p>
            <p><i>Branch: {purchase.course.branch}</i></p>
            <p><i>Invoice: {purchase.invoice}</i></p>
          </div>
          ))}
        </div>
       </div>
       
    </div>
  );
};

export default UserInfo;

