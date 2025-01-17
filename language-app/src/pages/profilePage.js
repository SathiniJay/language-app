import React, { useState, useEffect } from 'react';
import '../styles/profilePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCalendarAlt, faBookmark, faCog, faLanguage, faBullseye } from '@fortawesome/free-solid-svg-icons';
import CustomMenu from '../components/customMenu';
import axios from 'axios';
import Footer from '../components/footer';

const ProfilePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/accounts/profile/', {
          headers: {
              Authorization: `Token ${localStorage.getItem('authToken')}` 
          }
      })
        setProfileData(response.data);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };

    fetchProfileData();
  }, []);

  if (error) {
    return <p>{error}</p>; 
  }

  if (!profileData) {
    return <p>Loading...</p>; // Display loading state
  }

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h1>User Profile</h1>
        {isMenuOpen ? 
          <CustomMenu isOpen={isMenuOpen} className="menuContent" onClose={handleCloseMenu} /> :
          <button className="menuButton" onClick={handleMenuToggle}>
            <FontAwesomeIcon icon={faBars} className="menuIcon" />
          </button>
        }
      </header>
      <div className="profile-picture"></div>
      <h2 className="user-name">{profileData.username}</h2>
      <div className="info-card">
        <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
        <div>
          <h3>Joined Date</h3>
          <p>{profileData.joined_date}</p>
        </div>
      </div>
      <a className="info-card" href="/progress">
        <FontAwesomeIcon icon={faBookmark} className="icon" />
        <div>
          <h3>Progress</h3>
          <p>6 completed dialogues. No levels completed yet.</p>
        </div>
      </a>
      <a className="info-card" href="/settings">
        <FontAwesomeIcon icon={faCog} className="icon" />
        <h3>Settings</h3>
      </a>
      <a className="info-card" href="/language">
        <FontAwesomeIcon icon={faLanguage} className="icon" />
        <h3>Language</h3>
      </a>
      <a className="info-card" href="/setGoals">
        <FontAwesomeIcon icon={faBullseye} className="icon" />
        <h3>Set Goals</h3>
      </a>
      <Footer/>
    </div>
  );
};

export default ProfilePage;
