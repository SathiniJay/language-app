import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import "../styles/InfoGapListDeli.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomMenu from '../components/customMenu';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Plus from '@material-ui/icons/ControlPoint';
import Minus from '@material-ui/icons/RemoveCircleOutline';
import axios from 'axios';
import Footer from '../components/footer';

const InfoGapListDeli = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State variables
  const [infoGapListDeliData, setInfoGapListDeliData] = useState([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(null);
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [waitingMessage, setWaitingMessage] = useState("");
  const [error, setError] = useState(null);

  // Language and hint handling
  const [userLanguage, setUserLanguage] = useState(null);
  const [userLanguageName, setUserLanguageName] = useState('');
  const [languages, setLanguages] = useState([]);
  const [hintMap, setHintMap] = useState({});
  const [wordHint, setWordHint] = useState(null);
  const [hintPosition, setHintPosition] = useState({ x: 0, y: 0 });

  // UI control
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandInstruction, setExpandInstruction] = useState(false);

  // Props passed via route state
  const { level, subLevel, person, infoGapExerciseId, sessionCode } = location.state || {};

   // Handle hint click positioning and showing
  const handleWordClick = (word, event) => {
    const hint = hintMap[word.toLowerCase()];
    if (hint) {
      setWordHint({ hint });
      setHintPosition({ x: event.clientX + 10, y: event.clientY + 10 });
    }
  };

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);
  const handleCloseMenu = () => setIsMenuOpen(false);
  const toggleInstruction = () => setExpandInstruction(!expandInstruction);

    // Fetch data on initial load
  useEffect(() => {
    const fetchUserLanguage = async () => {//user's selected language 
      const userEmail = localStorage.getItem('userEmail');
      try {
        const response = await axios.get(`http://localhost:8000/api/appusers/email/${userEmail}/`);
        setUserLanguage(response.data.languageId);
      } catch (err) {
        console.error('Error fetching user language:', err);
      }
    };

    const fetchLanguages = async () => {//all languages
      try {
        const response = await axios.get('http://localhost:8000/api/languages/');
        setLanguages(response.data);
      } catch (err) {
        console.error('Error fetching languages:', err);
      }
    };

    const fetchListData = async () => {//exercise data
      try {
        const response = await axios.get("http://localhost:8000/api/InfoGapListDeliContent/");
        setInfoGapListDeliData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data from API:", error);
        setLoading(false);
      }
    };

    fetchListData();
    fetchUserLanguage();
    fetchLanguages();
  }, []);

    // Fetch language-specific hints for the exercise
  useEffect(() => {
    const fetchLanguageNameAndHints = async () => {
      if (userLanguage && infoGapExerciseId) {
        const language = languages.find(lang => lang.languageId === userLanguage);
        if (language) {
          setUserLanguageName(language.languageName);

          try {
            const response = await axios.get("http://localhost:8000/api/infoGapHints/", {
              params: {
                languageName: language.languageName,
                infoGapExerciseId: infoGapExerciseId
              }
            });

            const mappedHints = {};
            response.data.forEach(hint => {
              mappedHints[hint.word.toLowerCase()] = hint.hint;
            });

            setHintMap(mappedHints);
          } catch (err) {
            console.error("Error fetching hint data:", err);
          }
        }
      }
    };

    fetchLanguageNameAndHints();
  }, [userLanguage, languages, infoGapExerciseId]);

    // Polling logic: wait for both participants to complete before showing final screen
  useEffect(() => {
    let interval;
    if (exerciseCompleted && sessionCode) {
      const markAndCheck = async () => {
        try {
          const res = await axios.post("http://localhost:8000/api/mark-completed/", {
            session_code: sessionCode,
            person: person,
          });
          if (res.data.bothCompleted) {//if both have completed
            clearInterval(interval);
            setShowCompletion(true);
            setWaitingMessage("");
          } else {//if one person hasn't completed yet
            setWaitingMessage("Waiting for the other person to complete the exercise...");
          }
        } catch (err) {
          console.error("Error syncing completion:", err);
        }
      };
      markAndCheck();
      interval = setInterval(markAndCheck, 2000);
    }
    return () => clearInterval(interval);
  }, [exerciseCompleted, sessionCode, person]);

  // Handle drag-and-drop for prices/quantities
  const currentItem = infoGapListDeliData[currentItemIndex];

  const handleDrop = (e, type) => {
    const value = e.dataTransfer.getData("text/plain");
    if (type === "price") setSelectedPrice(value);
    else if (type === "quantity") setSelectedQuantity(value);
  };

  const handleDragStart = (e, value) => {
    e.dataTransfer.setData("text/plain", value);
  };

  const getHighlightClass = (selected, correct) => {
    if (!revealAnswer) return "";
    return selected === correct ? "correct" : "incorrect";
  };

  const handleReveal = () => setRevealAnswer(true);

  const handleNext = () => {
    if (currentItemIndex < infoGapListDeliData.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
      setSelectedPrice(null);
      setSelectedQuantity(null);
      setRevealAnswer(false);
    }
  };

  const handleCompleteExercise = () => setExerciseCompleted(true);

  // Loading and error states
  if (loading) return <div>Loading...</div>;
  if (!infoGapListDeliData.length) return <div>No exercise items found.</div>;

  // Hint popup (on word click)
  const hintPopup = wordHint && (
    <div className="hint-popup" style={{ top: hintPosition.y, left: hintPosition.x }}>
      <em>{wordHint.hint}</em>
      <div className="close-btn-wrapper">
        <button onClick={() => setWordHint(null)}>Close</button>
      </div>
    </div>
  );

  return (
    <motion.div className="ConversationMain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="conversation-header">
        <h1>Information Gap - Lists</h1>
        {isMenuOpen ? (
          <CustomMenu isOpen={isMenuOpen} className="menuContent" onClose={handleCloseMenu} />
        ) : (
          <button className="menuButton" onClick={handleMenuToggle}>
            <FontAwesomeIcon icon={faBars} className="menuIcon" />
          </button>
        )}
      </div>
 {/* Selected exercise data */}
      <div className="conversation-details">
        <p className="conversation-data">Level: {level}</p>
        <p className="conversation-data">Context: {subLevel}</p>
        <p className="conversation-data">Person: {person}</p>
      </div>

 {/* Instructions */}
      <div className="instruction" onClick={toggleInstruction}>
        <AnimatePresence>
          <p className="instruction-para">
            {expandInstruction ? (
              person === "A"
                ? "You went to the Deli to do some grocery shopping. Ask and find out from the Deli owner the prices per quantity of the items that you want to buy. Take your time and enjoy the activity!"
                : "You are the Deli Owner. You have all the information about the prices per quantities of all the grocery items. Help your friend find out the prices per quantity of the items that they want to buy. Take your time and enjoy the activity!"
            ) : "Instructions..."}
          </p>
          <span className="instruction-expand-icon">
            {expandInstruction ? <Minus /> : <Plus />}
          </span>
        </AnimatePresence>
      </div>

{/* Completion screen */}
      {showCompletion ? (
        <div className="info-gap-container">
          <h1>Exercise Completed!</h1>
          <p>Well Done!</p>
          <div className="completion-buttons">
            <button onClick={() => {
              setCurrentItemIndex(0);
              setSelectedPrice(null);
              setSelectedQuantity(null);
              setRevealAnswer(false);
              setExerciseCompleted(false);
              setShowCompletion(false);
            }}>Start Again</button>
            <button className="select-new-context" onClick={() =>
              navigate("/activity-selection/information-gap")
            }>Select new context</button>
          </div>
        </div>
      ) : (
        <>
        {/* Waiting message */}
          {waitingMessage && <p className="waiting-msg">{waitingMessage}</p>}
          
          {person === "B" ? (//Person B view
            <div className="info-gap-container">
              <table className="grocery-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {infoGapListDeliData.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <span onClick={(e) => handleWordClick(item.item_name, e)} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>
                          {item.item_name}
                        </span>
                      </td>
                      <td>{item.correct_price}</td>
                      <td>{item.correct_quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!showCompletion && (
                <div className="b-action-buttons">
                  <button className="complete-btn" onClick={handleCompleteExercise}>Complete Exercise</button>
                  <button className="select-new-context" onClick={() =>
                    navigate("/activity-selection/information-gap")
                  }>Select new context</button>
                </div>
              )}
            </div>
          ) : (// Person A view
            <div className="info-gap-container">
              <div className="item-block">
                <h2>
                  Grocery Item:{" "}
                  <span onClick={(e) => handleWordClick(currentItem.item_name, e)} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>
                    {currentItem.item_name}
                  </span>
                </h2>
                <div className="drop-zones">
                  <div className={`drop-zone ${getHighlightClass(selectedPrice, currentItem.correct_price)}`} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, "price")}>
                    {selectedPrice || "Drop Price Here"}
                  </div>
                  <div className={`drop-zone ${getHighlightClass(selectedQuantity, currentItem.correct_quantity)}`} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, "quantity")}>
                    {selectedQuantity || "Drop Quantity Here"}
                  </div>
                </div>

                {/* Options to drag */}
                <div className="options-section">
                  <div className="options-group">
                    <p>Price Options:</p>
                    {currentItem.price_options.map((price, i) => (
                      <div key={i} className="option-box" draggable onDragStart={(e) => handleDragStart(e, price)}>{price}</div>
                    ))}
                  </div>
                  <div className="options-group">
                    <p>Quantity Options:</p>
                    {currentItem.quantity_options.map((qty, i) => (
                      <div key={i} className="option-box" draggable onDragStart={(e) => handleDragStart(e, qty)}>{qty}</div>
                    ))}
                  </div>
                </div>
                
                <div className="action-buttons">
                  {!revealAnswer ? (
                    <>
                      <button className="reveal-button" onClick={handleReveal} disabled={!selectedPrice || !selectedQuantity}>Reveal Answer</button>
                      <button className="select-new-context" onClick={() =>
                        navigate("/activity-selection/information-gap")
                      }>Select new context</button>
                    </>
                  ) : currentItemIndex < infoGapListDeliData.length - 1 ? (
                    <>
                      <button className="next-button" onClick={handleNext}>Next Item</button>
                      <button className="select-new-context" onClick={() =>
                        navigate("/activity-selection/information-gap")
                      }>Select new context</button>
                    </>
                  ) : (
                    <>
                      <button className="complete-btn" onClick={handleCompleteExercise}>Complete Exercise</button>
                      <button className="select-new-context" onClick={() =>
                        navigate("/activity-selection/information-gap")
                      }>Select new context</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Hint pop-up if word clicked */}
      {hintPopup}
      <Footer />
    </motion.div>
  );
};

export default InfoGapListDeli;
