import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUser,
  faLanguage,
  faInfoCircle,
  faChartLine,
  faCog,
  faTimes,
  faSignOut
} from '@fortawesome/free-solid-svg-icons';
import '../styles/customMenu.css';

const CustomMenu = ({ isOpen, onClose }) => {

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login'); // Redirect to login page after logout
  };

  const toggleModal = () => {
    setShowModal(!showModal); // Toggle modal visibility
  };

  return (
    <>
      <Menu right isOpen={isOpen} onStateChange={({ isOpen }) => !isOpen && onClose()}>
        <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="menu-header">
          <h2 className='menu-heading'>Menu</h2>
        </div>
        <div className='menu-body'>
          <a className="menu-item" href="/home">
              <FontAwesomeIcon icon={faHome} color={'#d10074'} className="icon" /> Discover
          </a>
          <a className="menu-item" href="/profile">
            <FontAwesomeIcon icon={faUser} color={'#d10074'} className="icon" /> Profile
          </a>
          <a className="menu-item" href="/language">
              <FontAwesomeIcon icon={faLanguage} color={'#d10074'} className="icon" /> Language
          </a>
          <a className="menu-item" href="/activity-selection">
              <FontAwesomeIcon icon={faInfoCircle} color={'#d10074'} className="icon" /> Activity Selection
          </a>
          <a className="menu-item" href="/progress">
            <FontAwesomeIcon icon={faChartLine} color={'#d10074'} className="icon" /> Progress
          </a>
          <a className="menu-item" href="/settings">
              <FontAwesomeIcon icon={faCog} color={'#d10074'} className="icon" /> Settings
          </a>
          <a className="menu-item" href="#logout" onClick={toggleModal}>
            <FontAwesomeIcon icon={faSignOut} color={'#d10074'} className="icon" /> Logout
          </a>
        </div>
      </Menu>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <button onClick={handleLogout}>YES</button>
            <button onClick={toggleModal}>NO</button>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomMenu;
