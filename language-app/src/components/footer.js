// src/components/Footer.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/footer.css'; 

const Footer = () => {
  const navigate = useNavigate(); 

  const handleCreditsClick = () => {
    navigate('/credits'); // Navigate to the credits page
  };

  return (
    <footer className="footer">
      <p onClick={handleCreditsClick}>
        Co-Creators Team © 2022
      </p>
    </footer>
  );
};

export default Footer;
