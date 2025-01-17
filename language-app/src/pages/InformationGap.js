import {React, useState} from "react";
import '../styles/InformationGap.css';
import CustomMenu from '../components/customMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';

const InformationGap = () => {
const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return(
    <div className="infoGap-container">
    <header className="infoGap-header">
      <h1>InformationGap</h1>
      {isMenuOpen ? 
        <CustomMenu isOpen={isMenuOpen} className="menuContent" onClose={handleCloseMenu} /> :
        <button className="menuButton" onClick={handleMenuToggle}>
          <FontAwesomeIcon icon={faBars} className="menuIcon" />
        </button>
      }
    </header>
    </div>
  );
}

export default InformationGap;