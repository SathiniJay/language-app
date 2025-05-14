import { React, useState } from "react";
import '../styles/InformationGap.css';
import { motion } from 'framer-motion';
import CustomMenu from '../components/customMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';

const InformationGap = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage whether the side menu is open

  const handleMenuToggle = () => {// Toggle function for opening/closing the side menu
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {  // Close the menu (used by CustomMenu's onClose)
    setIsMenuOpen(false);
  };

  return (
    <motion.div className="InformationGapMain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="infoGap-header">
        <h1>Information Gap</h1>
        {isMenuOpen ?
          <CustomMenu isOpen={isMenuOpen} className="menuContent" onClose={handleCloseMenu} /> :
          <button className="menuButton" onClick={handleMenuToggle}>
            <FontAwesomeIcon icon={faBars} className="menuIcon" />
          </button>
        }
      </div>
      {/* For displaying selected level, context, and person role */}
      <div className="infoGap-details">
        <p className="infoGap-data">Level: </p>
        <p className="infoGap-data">Context: </p>
        <p className="infoGap-data">Person: </p>
      </div>
      <div className="BodyContent">
        <div className="Description">
          <h2>Welcome to the LVS Role Play App!</h2>
          <p>Select the type of Information Gap activity you want to practice</p>
        </div>
        <div className="ButtonSel">
          <button className="InfoGapMaps" onClick={() => navigate("/activity-selection/information-gap-exercise", { state: { type: "maps" } })}>Information Gap Maps</button>
          <button className="InfoGapMatrices" onClick={() => navigate("/activity-selection/information-gap-exercise", { state: { type: "matrices" } })}>Information Gap Matrices</button>
          <button className="InfoGapLists" onClick={() => navigate("/activity-selection/information-gap-exercise", { state: { type: "lists" } })}>Information Gap Lists</button>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}

export default InformationGap;
