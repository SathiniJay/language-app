import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import "../styles/InfoGapMatricesInterview.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomMenu from '../components/customMenu';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Plus from '@material-ui/icons/ControlPoint';
import Minus from '@material-ui/icons/RemoveCircleOutline';
import axios from 'axios';
import Footer from '../components/footer';

const InfoGapMatricesInterview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get passed data from route state
  const person = location.state?.person || "A";
  const { level, subLevel, sessionCode } = location.state || {};

   // Matrix content and user interaction state
  const [allRows, setAllRows] = useState([]);// All matrix rows from the backend
  const [matrix, setMatrix] = useState([]);// User's answer state
  const [filteredRows, setFilteredRows] = useState([]);// Prompts filtered by person (A or B)
  const [visiblePromptIndex, setVisiblePromptIndex] = useState(0);
  const [reveal, setReveal] = useState(false);

  // Exercise session syncing
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [waitingMessage, setWaitingMessage] = useState("");

  // Language fetching
  const [userLanguage, setUserLanguage] = useState(null);
  const [userLanguageName, setUserLanguageName] = useState('');
  const [languages, setLanguages] = useState([]);

  // UI interaction
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandInstruction, setExpandInstruction] = useState(false);

  const toggleInstruction = () => setExpandInstruction(!expandInstruction);

  // Fetch matrix content and user language
  useEffect(() => {
    const fetchMatrixData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/InfoGapMatricesInterviewContent/");
        const data = await response.json();
        setAllRows(data);
        setMatrix(data.map(row => ({ ...row, value: "" })));
        setFilteredRows(data.filter(row => row.person === person));
      } catch (error) {
        console.error("Failed to load matrix data:", error);
      }
    };

    const fetchUserLanguage = async () => {//user selected language
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

    fetchMatrixData();
    fetchUserLanguage();
    fetchLanguages();
  }, [person]);

  useEffect(() => {
    const fetchLanguageName = async () => {//language name by languageid
      if (userLanguage) {
        const language = languages.find(lang => lang.languageId === userLanguage);
        if (language) {
          setUserLanguageName(language.languageName);
        }
      }
    };
    fetchLanguageName();
  }, [userLanguage, languages]);

    // Sync completion status between two users
  useEffect(() => {
    let interval;
    if (exerciseCompleted && sessionCode) {
      const markAndCheck = async () => {
        try {
          const res = await axios.post("http://localhost:8000/api/mark-completed/", {
            session_code: sessionCode,
            person: person,
          });
          if (res.data.bothCompleted) {//if both completed
            clearInterval(interval);
            setShowCompletion(true);
            setWaitingMessage("");
          } else {//if one is yet to complete
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

   // Drag start for draggable options
  const handleDragStart = (e, name) => {
    e.dataTransfer.setData("text/plain", name);
  };

  // Handle drop into a matrix cell
  const handleDrop = (e, targetRowIndex) => {
    const name = e.dataTransfer.getData("text/plain");
    const updatedMatrix = matrix.map((row, index) => {
      if (row.value === name) return { ...row, value: "" }; // remove from old cell
      return row;
    });
    updatedMatrix[targetRowIndex].value = name;
    setMatrix(updatedMatrix);
  };

  // Move to the next prompt
  const handleNextPrompt = () => {
    if (visiblePromptIndex < filteredRows.length - 1) {
      setVisiblePromptIndex(prev => prev + 1);
    }
  };

    // Reset exercise
  const handleReset = () => {
    setMatrix(allRows.map(row => ({ ...row, value: "" })));
    setVisiblePromptIndex(0);
    setReveal(false);
    setExerciseCompleted(false);
    setShowCompletion(false);
    setWaitingMessage("");
  };

  //get answers
  const allAnswers = [...new Set(allRows.map(row => row.correct_name))];
  const availableAnswers = allAnswers.filter(
    name => !matrix.some(row => row.value === name)
  );

  const mainContent = showCompletion ? (//if exercise completed
    <div className="matrices-container">
      <h1>Exercise Completed!</h1>
      <p>Well Done!</p>
      <button className="select-new-context" onClick={() => navigate("/activity-selection/information-gap")}>
        Select New Context
      </button>
    </div>
  ) : (//if exercise ongoing
    <div className="matrices-container">
      {/* Prompt based on filtered data and turn */}
      <div className="prompt-box">
        <p>{filteredRows[visiblePromptIndex]?.prompt}</p>
        {visiblePromptIndex < filteredRows.length - 1 && (
          <button onClick={handleNextPrompt}>Next Prompt</button>
        )}
      </div>

 {/* Matrix table */}
      <div className="matrix-grid">
        {matrix.map((row, i) => {
          const isCorrect = row.value === row.correct_name;
          const highlightClass = reveal && row.value
            ? isCorrect ? "correct" : "incorrect"
            : "";

          return (
            <div
              key={i}
              className="matrix-row"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, i)}
            >
              <span className="matrix-label">{row.label}</span>
              <div
                className={`matrix-cell ${highlightClass}`}
                draggable={!!row.value}
                onDragStart={(e) => row.value && handleDragStart(e, row.value)}
              >
                {row.value || "Drop here"}
              </div>
            </div>
          );
        })}
      </div>

 {/* Options to drag into cells */}
      <div className="answer-options">
        <h3>Answer Options:</h3>
        <div className="options-container">
          {availableAnswers.map((name, i) => (
            <div
              key={i}
              className="option-box"
              draggable
              onDragStart={(e) => handleDragStart(e, name)}
            >
              {name}
            </div>
          ))}
        </div>
      </div>

      <div className="action-buttons">
        <button
          onClick={() => setReveal(true)}
          disabled={visiblePromptIndex < filteredRows.length - 1}
        >
          Reveal Answers
        </button>
        <button onClick={handleReset}>Reset</button>

        {reveal && !exerciseCompleted && (
          <button onClick={() => setExerciseCompleted(true)}>Complete Exercise</button>
        )}
        {waitingMessage && <p className="waiting-msg">{waitingMessage}</p>}

        <button className="select-new-context" onClick={() => navigate("/activity-selection/information-gap")}>
          Select New Context
        </button>
      </div>

{/* Correct answers display */}
      {reveal && (
        <div className="reveal-box">
          <h4>Correct Answers:</h4>
          <ul>
            {allRows.map((row, i) => (
              <li key={i}>{row.correct_name} → {row.label}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      className="ConversationMain"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="conversation-header">
        <h1>Information Gap - Matrices</h1>
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
                ? "You and a colleague have been given only 15 minutes to sift applications for an interview panel. You are only allowed to invite two people to the interview. You have each looked at two applications and now need to share the results with your colleague..."
                : "You and a colleague have been given only 15 minutes to sift applications for an interview panel. Help your partner by sharing what you know about your candidates..."
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

export default InfoGapMatricesInterview;
