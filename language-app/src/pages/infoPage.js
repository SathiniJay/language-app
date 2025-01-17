// src/pages/infoPage.js
import React from 'react';
import '../styles/infoPage.css';
import learningImage from '../assets/info.png';
import fluencyImage from '../assets/fluency.png';
import { useNavigate } from 'react-router-dom';

const InfoPage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
  };

  return (
    <div className="info-container" onClick={handleClick}>
      <div className="card">
        <img src={learningImage} alt="Learning" className="image" />
        <h2>Developed for you!</h2>
        <p>
          No matter the level of experience, our platform has it all.
          From beginner to advanced, all the exercises are made to facilitate the learning on a new language.
        </p>
      </div>
      <div className="card">
        <img src={fluencyImage} alt="Fluency" className="image" />
        <h2>Fluency</h2>
        <p>
          The perfect platform to boost your fluency in different languages.
        </p>
      </div>
      <footer className="footer">
        <p>Co-Creators Team © 2022</p>
      </footer>
    </div>
  );
};

export default InfoPage;
