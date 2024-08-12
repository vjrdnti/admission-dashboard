import React, { useState } from 'react';
import '../purchasespopup.css';

const Posted = ({ postedCourses }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('verified'); // State for active tab

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleTabChange = (tab) => setActiveTab(tab);

  // Filter courses based on status
  const verifiedCourses = postedCourses.filter(post => post.status === 'verified');
  const unverifiedCourses = postedCourses.filter(post => post.status !== 'verified');

  return (
    <div>
      <button className="open-modal-btn" onClick={openModal}>
        Courses you posted
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Your Courses</h2>
            <div className="tabs">
              <button 
                className={`tab-button ${activeTab === 'verified' ? 'active' : ''}`} 
                onClick={() => handleTabChange('verified')}
              >
                Verified
              </button>
              <button 
                className={`tab-button ${activeTab === 'unverified' ? 'active' : ''}`} 
                onClick={() => handleTabChange('unverified')}
              >
                Unverified
              </button>
            </div>

            <div className="posts">
              {activeTab === 'verified' && verifiedCourses.length > 0 ? (
                verifiedCourses.map((post, index) => (
                  <div key={index} className="post">
                    <p><b><i>Course: {post.branch}</i></b></p>
                    <p><i>Course ID: {post.id}</i></p>
                    <p><i>Verification: {post.status}</i></p>
                  </div>
                ))
              ) : activeTab === 'unverified' && unverifiedCourses.length > 0 ? (
                unverifiedCourses.map((post, index) => (
                  <div className="post">
                    <p><b><i>Course: {post.branch}</i></b></p>
                    <p><i>Course ID: {post.id}</i></p>
                    <p><i>Verification: {post.status}</i></p>
                  </div>
                ))
              ) : (
                <p>No courses available in this category.</p>
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

export default Posted;

