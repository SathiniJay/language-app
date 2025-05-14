import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import "../styles/InfoGapMapTownCentre.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomMenu from '../components/customMenu';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Plus from '@material-ui/icons/ControlPoint';
import Minus from '@material-ui/icons/RemoveCircleOutline';
import axios from 'axios';
import Footer from '../components/footer';

const InfoGapMapTownCentre = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve props from route
  const person = location.state?.person || "A";
  const { level, subLevel, sessionCode } = location.state || {};

  // State for grid and interaction
  const [grid, setGrid] = useState([]);// Raw map data
  const [blankPlaces, setBlankPlaces] = useState([]);// List of places to be dragged
  const [filledAnswers, setFilledAnswers] = useState({});// User-placed answers
  const [revealAnswer, setRevealAnswer] = useState(false);

  // Session management
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [waitingMessage, setWaitingMessage] = useState("");

  // UI controls
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandInstruction, setExpandInstruction] = useState(false);

  const toggleInstruction = () => setExpandInstruction(!expandInstruction);

  // Fetch grid content on load
  useEffect(() => {
    const fetchGridData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/InfoGapMapTownCentreContent/");
        const data = await response.json();
        setGrid(data);
        const blanks = data.filter(cell => cell.is_blank).map(cell => cell.correct_place);// Get correct answers for blanks
        setBlankPlaces(blanks);
      } catch (error) {
        console.error("Error fetching map cells:", error);
      }
    };
    fetchGridData();
  }, []);

  // Polling to check if both people have completed
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

  // Drag and drop handlers
  const handleDragStart = (e, place) => {
    e.dataTransfer.setData("text/plain", place);
  };

  const handleDrop = (e, row, col) => {
    const place = e.dataTransfer.getData("text/plain");
    const key = `${row}-${col}`;
    setFilledAnswers(prev => {
      const newAnswers = { ...prev };
      // Ensure a place is not used in multiple cells
      Object.keys(newAnswers).forEach(k => {
        if (newAnswers[k] === place) delete newAnswers[k];
      });
      newAnswers[key] = place;
      return newAnswers;
    });
  };

  // Get available options that haven't been used
  const getUsedAnswers = () => Object.values(filledAnswers);
  const getAvailableAnswers = () => blankPlaces.filter(place => !getUsedAnswers().includes(place));

  //The label to show in each cell
  const getCellLabel = (cell) => {
    const key = `${cell.row}-${cell.col}`;
    const filled = filledAnswers[key];
    const correct = cell.correct_place;

    if (person === "B") return correct;
    if (!cell.is_blank) return correct;
    if (!revealAnswer) return filled || "";
    return (
      <span className={filled === correct ? "correct" : "incorrect"}>
        {filled || "?"}
      </span>
    );
  };

  // Renders the full grid with the interactive drop zones
  const renderGrid = () => {
    if (grid.length === 0) return <p>Loading map...</p>;

    const gridSize = Math.max(...grid.map(cell => Math.max(cell.row, cell.col))) + 1;

    return (
      <div className="map-grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
        {grid.map((cell) => {
          const key = `${cell.row}-${cell.col}`;
          const isInteractive = cell.is_blank && person === "A" && !revealAnswer;
          const filled = filledAnswers[key];

          return (
            <div
              key={key}
              className={`grid-cell ${cell.is_blank ? "blank" : "filled"}`}
              onDragOver={isInteractive ? (e) => e.preventDefault() : undefined}
              onDrop={isInteractive ? (e) => handleDrop(e, cell.row, cell.col) : undefined}
            >
              {isInteractive && filled ? (
                <div
                  className="draggable-answer"
                  draggable
                  onDragStart={(e) => handleDragStart(e, filled)}
                >
                  {filled}
                </div>
              ) : (
                getCellLabel(cell)
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const mainContent = showCompletion ? (// If the exercise is complete
    <div className="map-exercise-container">
      <h1>Exercise Completed!</h1>
      <p>Well Done!</p>
      <button className="select-new-context" onClick={() => navigate("/activity-selection/information-gap")}>
        Select New Context
      </button>
    </div>
  ) : (// If the exercise is ongoing
    <div className="map-exercise-container">
      {renderGrid()}

      {person === "A" && !revealAnswer && (//Draggable options shown only to Person A before revealing answers 
        <div className="answer-options">
          {getAvailableAnswers().map((place, i) => (
            <div key={i} className="option-box" draggable onDragStart={(e) => handleDragStart(e, place)}>
              {place}
            </div>
          ))}
        </div>
      )}

      <div className="action-buttons">
        {person === "A" && !revealAnswer && (
          <button onClick={() => setRevealAnswer(true)}>Reveal Answers</button>
        )}
        {((person === "A" && revealAnswer) || person === "B") && !exerciseCompleted && (
          <button onClick={() => setExerciseCompleted(true)}>Complete Exercise</button>
        )}
        {waitingMessage && <p className="waiting-msg">{waitingMessage}</p>}
        <button className="select-new-context" onClick={() => navigate("/activity-selection/information-gap")}>
          Select New Context
        </button>
      </div>
    </div>
  );

  return (
    <motion.div className="ConversationMain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="conversation-header">
        <h1>Information Gap - Maps</h1>
        {isMenuOpen ? (
          <CustomMenu isOpen={isMenuOpen} className="menuContent" onClose={() => setIsMenuOpen(false)} />
        ) : (
          <button className="menuButton" onClick={() => setIsMenuOpen(true)}>
            <FontAwesomeIcon icon={faBars} className="menuIcon" />
          </button>
        )}
      </div>

      {/* Exercise data */}
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
                ? "You've spilt ink across your copy of the map of the town center. Call your friend and find out what places they can see and then help them fill in the gaps by explaining where the missing locations are in relation to the places you both know. Take your time and enjoy the activity!"
                : "You have the complete map of the Town Centre. Help your friend and find the missing locations of the map. Take your time and enjoy the activity!"
            ) : "Instructions..."}
          </p>
          <span className="instruction-expand-icon">
            {expandInstruction ? <Minus /> : <Plus />}
          </span>
        </AnimatePresence>
      </div>

      <div className="MainBody">{mainContent}</div>
      <Footer />
    </motion.div>
  );
};

export default InfoGapMapTownCentre;
