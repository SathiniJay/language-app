// src/pages/homePage.js
import React, { useState } from 'react';
import styles from '../styles/homePage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import mindthegap from '../assets/mindthegap.png';
import roleplay from '../assets/roleplay.png';
import CustomMenu from '../components/customMenu';
import Footer from '../components/footer';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className={styles.discoverContainer}>
      <header className={styles.header}>
        <h1>Discover</h1>
        {isMenuOpen ? 
          <CustomMenu isOpen={isMenuOpen} className={styles.menuContent} onClose={handleCloseMenu} /> :
          <button className={styles.menuButton} onClick={handleMenuToggle}>
            <FontAwesomeIcon icon={faBars} className={styles.menuIcon} />
          </button>
        }
      </header>
      <h2 className='heading2'>Welcome to SCC Language!</h2>
      <div className={styles.newFeatures}>
        <div className={styles.fcard}>
          <div className={[styles.featureCardYellow]}/>
          <p className={styles.featureCardText}>A new language was added</p>
        </div>
        <div className={styles.fcard}>
          <div className={styles.featureCardPink}/>
          <p className={styles.featureCardText}>Upcoming: more information-gap exercises</p>
        </div>
      </div>
      <div className={styles.infoCard}>
        <img src={mindthegap} alt="Mind the gap" className={styles.infoImage} />
        <div className={styles.infoText}>
          <h3>Information-gap</h3>
          <p>Talk to each other to find the missing information.</p>
          <button className={styles.exploreButton}>Explore</button>
        </div>
      </div>
      <div className={styles.infoCard}>
        <img src={roleplay} alt="Roleplay exercise" className={styles.infoImage} />
        <div className={styles.infoText}>
          <h3>Roleplay exercise</h3>
          <p>Upgrade your knowledge by roleplaying.</p>
          <button className={styles.exploreButton}>Explore</button>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default HomePage;
