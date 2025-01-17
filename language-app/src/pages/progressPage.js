// src/pages/ProgressPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import '../styles/progressPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBookmark, faLanguage } from '@fortawesome/free-solid-svg-icons';
import CustomMenu from '../components/customMenu';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Footer from '../components/footer';
import tick from '../assets/tick.png';


const ProgressPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [checkedItems, setCheckedItems] = useState({});
  const [languages, setLanguages] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState([]); 
  const [progressData, setProgressData] = useState([]); 

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleChange = (id) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/accounts/profile/', {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`,
          },
        });
        setUserName(response.data);
      } catch (err) {
        console.error('Failed to fetch user details:', err);
        setError('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // Fetch languages from the database
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/languages/', {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`,
          },
        });
        setLanguages(response.data);
        // Initialize checkedItems with the languages from the API
        const initialCheckedItems = {};
        response.data.forEach((language) => {
          initialCheckedItems[language.languageId] = false; 
        });
        setCheckedItems(initialCheckedItems);
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    fetchLanguages();
  }, []);

  // Fetch progress data when selected languages change
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail'); // Get the user's email from local storage

        if (!userEmail) {
          console.error('User email is missing');
          return; // Exit early if user email is not available
        }

        const response = await axios.get('http://localhost:8000/api/progress/', {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`,
          },
          params: { user: userEmail }, // Pass the user email as a query parameter
        });

        // Set the progress data directly from the API response
        setProgressData(response.data);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      }
    };

    fetchProgressData();
  }, []);


  const handleShowProgress = () => {
    // Update selectedLanguages based on checkedItems
    const selected = languages.filter((lang) => checkedItems[lang.languageId]);
    setSelectedLanguages(selected);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="progress-container">
      <header className="progress-header">
        <h1>Progress</h1>
        {isMenuOpen ? 
          <CustomMenu isOpen={isMenuOpen} className="menuContent" onClose={handleCloseMenu} /> :
          <button className="menuButton" onClick={handleMenuToggle}>
            <FontAwesomeIcon icon={faBars} className="menuIcon" />
          </button>
        }
      </header>
      <div className="profile-picture"></div>
      <h2 className="user-name">{userName.username}</h2>
      <div className="info-card">
        <FontAwesomeIcon icon={faBookmark} className="icon" />
        <div>
          <h3>Progress</h3>
          <p>6 completed dialogues. No levels completed yet.</p>
        </div>
      </div>
      <div className="select-language">
        <FontAwesomeIcon icon={faLanguage} className="icon" />
        <h3>Select Practising Language</h3>
        {languages.map((lang) => (
          <li key={lang.languageId} className="language-item">
            <label>
              <input
                type="checkbox"
                checked={checkedItems[lang.languageId] || false}
                onChange={() => handleChange(lang.languageId)}
              />
              {checkedItems[lang.languageId] ? (
                <CheckBoxIcon className="custom-checkbox" />
              ) : (
                <CheckBoxOutlineBlankIcon className="custom-checkbox" />
              )}
              {lang.languageName}
            </label>
          </li>
        ))}
        <button className="show-prg" onClick={handleShowProgress}>Show Progress</button>
      </div>
      {selectedLanguages.length > 0 && (
  <div className="completed-dialogues">
    {selectedLanguages.map((lang) => {
      // Filter and process progress data for the current language
      const languageProgressData = progressData
        .filter((progress) => progress.language_name === lang.languageName)
        .reduce((acc, progress) => {
          const existingContext = acc.find(item => item.context === progress.conversation_context);
          if (!existingContext) {
            acc.push({
              context: progress.conversation_context,
              scenarios: [{
                scenario: progress.conversation_scenario,
                persons: {
                  A: progress.person === 'A' ? progress.completed_times : 0,
                  B: progress.person === 'B' ? progress.completed_times : 0
                }
              }],
              level: progress.conversation_level
            });
          } else {
            const existingScenario = existingContext.scenarios.find(s => s.scenario === progress.conversation_scenario);
            if (!existingScenario) {
              existingContext.scenarios.push({
                scenario: progress.conversation_scenario,
                persons: {
                  A: progress.person === 'A' ? progress.completed_times : 0,
                  B: progress.person === 'B' ? progress.completed_times : 0
                }
              });
            } else {
              // Update existing scenario's persons data
              existingScenario.persons[progress.person] = progress.completed_times;
            }
          }
          return acc;
        }, [])
        .reduce((levelAcc, contextData) => {
          const existingLevel = levelAcc.find(item => item.level === contextData.level);
          if (!existingLevel) {
            levelAcc.push({
              level: contextData.level,
              contexts: [contextData]
            });
          } else {
            existingLevel.contexts.push(contextData);
          }
          return levelAcc;
        }, []);

      return (
        <div key={lang.languageId}>
          <h3>Completed dialogues in {lang.languageName}</h3>
          {languageProgressData.length === 0 ? (
            <div className="no-progress-message">
              No progress data available
            </div>
          ) : (
            <ul>
              {languageProgressData.map((levelData) => (
                <div key={levelData.level} className="level-section">
                  <div className="level-header">Level {levelData.level}</div>
                  {levelData.contexts.map((contextData) => (
                    <div key={contextData.context} className="context-section">
                      <div className="context-item">
                        <img src={tick} alt="Checked" className="tick-icon" />
                        <div>{contextData.context}</div>
                      </div>
                      <div>
                        <ul>
                          {contextData.scenarios.map((scenarioData, index) => (
                              <li key={index}>
                                <div className='scenario-item'>
                                  {scenarioData.scenario}
                                  <div className="dialogue-progress">
                                    <div className="progress-label">A</div>
                                    <div className="progress-number">{scenarioData.persons.A}</div>
                                    <div className="progress-label">B</div>
                                    <div className="progress-number">{scenarioData.persons.B}</div>
                                  </div>
                                </div>
                              </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </ul>
          )}
        </div>
      );
    })}
  </div>
)}
      <Footer />
    </div>
  );
};

export default ProgressPage;
