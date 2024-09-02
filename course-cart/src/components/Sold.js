import React, { useState } from 'react';
import '../purchasespopup.css';

const Sold = ({ Sold }) => {
  const [showModal, setShowModal] = useState(false);
 

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);


  return (
    <div>
      <button className="open-modal-btn" onClick={openModal}>
        Courses you sold
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Courses sold</h2>

            <div className="posts">
              {Sold.length > 0 ? (
                Sold.map((post, index) => (
                  <div key={index} className="post">
                    <p><b><i>Course: {post.course.branch}</i></b></p>
                    <p><i>Course ID: {post.course.id}</i></p>
                    <p><i>user: {post.user.email}</i></p>
                  </div>
                ))
              ) : (
                <p>No courses sold yet.</p>
              )}
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

export default Sold;

