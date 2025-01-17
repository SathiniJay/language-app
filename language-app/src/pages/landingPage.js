// src/pages/landingPage.js
import React from 'react';
import '../styles/landingPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faApple, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="lcard">
        <h1>The best way to learn a new language.</h1>
        <p>Exercises designed to facilitate learning new languages.</p>
        <button className="try-button" onClick={() => navigate('/info')}>Try it now!</button>
        <div className="divider"></div> or <div className="divider"></div>
        <div className="social-buttons">
          <button className="google-button">
            <FontAwesomeIcon icon={faGoogle} className="icon" /> Google
          </button>
          <button className="apple-button">
            <FontAwesomeIcon icon={faApple} className="icon" /> Apple
          </button>
          <button className="facebook-button">
            <FontAwesomeIcon icon={faFacebook} className="icon" /> Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
