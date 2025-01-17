import React, {useState} from "react";
import '../styles/ActivitySelection.css';
import {motion} from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import CustomMenu from '../components/customMenu';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/footer';

function ActivitySelection(){
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };


    return(
        <motion.div className="ActivitySelectionMain" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <div className="activity-header">
                <h1>Activity Selection</h1>
                {isMenuOpen ? 
                    <CustomMenu isOpen={isMenuOpen} className="menuContent" onClose={handleCloseMenu} /> :
                    <button className="menuButton" onClick={handleMenuToggle}>
                        <FontAwesomeIcon icon={faBars} className="menuIcon" />
                    </button>
                }
            </div>
            <div className="activity-details">
                    <p className="activity-data">Level: </p>
                    <p className="activity-data">Context: </p>
                    <p className="activity-data">Person: </p>
            </div>
            <div className="BodyContent">
                <div className="Description">
                    <h2>Welcome to the LVS Role Play App!</h2>
                    <p>Select the type of activity you want to practice</p>
                </div>
                <div className="ButtonSel">
                    <button className="convo"onClick={()=> navigate("/activity-selection/conversations")}>Conversations</button>
                    <button className="InfoGap" disabled>Information Gap</button>
                </div>
            </div>
            <Footer/>
        </motion.div>
    )
}

export default ActivitySelection