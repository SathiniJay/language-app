import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Conversations.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomMenu from '../components/customMenu';
import { faBars, faCheckCircle, faFilter, faArrowDownWideShort, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useNavigate } from 'react-router-dom';
import Plus from '@material-ui/icons/ControlPoint';
import Minus from '@material-ui/icons/RemoveCircleOutline';
import axios from "axios";
import Footer from '../components/footer';

function Conversations() {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedLevel, setExpandedLevel] = useState(null);
  const [expandedContext, setExpandedContext] = useState(null);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedSubLevel, setSelectedSubLevel] = useState(null);
  const [convoSelected, setConvoSelected] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [personSelected, setPersonSelected] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [expandInstruction, setExpandInstruction] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchCount, setSearchCount] = useState(0);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false); 
  const [showContextDropdown, setShowContextDropdown] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedContexts, setSelectedContexts] = useState([]);
  const [selectedScenarios, setSelectedScenarios] = useState([]);
  const [filteredData, setFilteredData] = useState();
  const [isSearchInitiated, setIsSearchInitiated] = useState(false);

  
  const [convContent, setConvContent] = useState([]);

  useEffect(() => {
      axios.get('http://localhost:8000/api/conversations/')
          .then(response => {
              setConvContent(response.data);
              setFilteredData(response.data);
          })
          .catch(error => {
              console.error('There was an error fetching the conversations!', error);
          });
  }, []);

  const groupByLevelAndContext = (conversations) => {
    return conversations.reduce((acc, conversation) => {
      const level = conversation.conversationLevel;
      if (!acc[level]) {
        acc[level] = {};
      }
      const context = conversation.context;
      if (!acc[level][context]) {
        acc[level][context] = [];
      }
      acc[level][context].push(conversation);
      return acc;
    }, {});
  };

  const groupedConversations = groupByLevelAndContext(filteredData || []);
  const sortedLevels = Object.keys(groupedConversations).sort();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleLevel = (levelIndex) => {
    setExpandedLevel(expandedLevel === levelIndex ? null : levelIndex);
    setExpandedContext(null);
  };

  const toggleContext = (contextIndex) => {
    setExpandedContext(expandedContext === contextIndex ? null : contextIndex);
  };

  const setConvo = (level, context, convo, conversationId) => {
    setSelectedConvo(convo);
    setSelectedLevel(level);
    setSelectedSubLevel(`${context} - ${convo}`);
    setSelectedConversationId(conversationId);
    setTimeout(() => {
        setConvoSelected(true);
    }, 500);
};


  const toggleInstruction = () => {
    setExpandInstruction(!expandInstruction);
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    setFilterVisible(false);
    setSearchQuery("");
    setSearchResults([]);
    setSearchCount(0);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchCount(0);
    setCurrentSearchIndex(0);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
        alert("Please enter a search term.");
        return;
    }
    
    const results = [];
    let count = 0;
    
    convContent.forEach((item, i) => {
        // Check conversationLevel
        if (item.conversationLevel.toLowerCase().includes(searchQuery.toLowerCase())) {
            results.push({ type: 'level', levelIndex: i, keyword: item.conversationLevel });
            count += 1;
        }
        // Check context
        if (item.context.toLowerCase().includes(searchQuery.toLowerCase())) {
            results.push({ type: 'context', levelIndex: i, keyword: item.context });
            count += 1;
        }
        // Check scenarios (if it's an array)
        if (Array.isArray(item.scenario)) {
            item.scenario.forEach((scenario, k) => {
                if (scenario.toLowerCase().includes(searchQuery.toLowerCase())) {
                    results.push({ type: 'scenario', levelIndex: i, scenarioIndex: k, keyword: scenario });
                    count += 1;
                }
            });
        } else if (item.scenario && item.scenario.toLowerCase().includes(searchQuery.toLowerCase())) {
            // Check single scenario (not an array)
            results.push({ type: 'scenario', levelIndex: i, scenarioIndex: 0, keyword: item.scenario });
            count += 1;
        }
    });

    setSearchResults(results);
    setSearchCount(count);  // Set search count based on the total results
    setCurrentSearchIndex(0);
    setIsSearchInitiated(true);  // Mark that the search has been initiated
};

  

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
    setSearchVisible(false);
  }

  const toggleLevelDropdown = () => {
    setShowLevelDropdown(!showLevelDropdown);
    setShowContextDropdown(false); // Close context dropdown when levels are toggled
  };

  const handleLevelSelection = (level) => {
    setSelectedLevels((prev) => 
      prev.includes(level) 
        ? prev.filter((l) => l !== level) 
        : [...prev, level]
    );
  };

  const toggleContextDropdown = () => {
    setShowContextDropdown(!showContextDropdown);
    setShowLevelDropdown(false); // Close level dropdown when contexts are toggled
  };

  const handleContextSelection = (level, context) => {
    setSelectedContexts((prevSelectedContexts) => {
      const contextsForLevel = prevSelectedContexts[level] || [];
  
      if (contextsForLevel.includes(context)) {
        // If context is already selected for this level, remove it
        return {
          ...prevSelectedContexts,
          [level]: contextsForLevel.filter((c) => c !== context)
        };
      } else {
        // Otherwise, add the context for this level
        return {
          ...prevSelectedContexts,
          [level]: [...contextsForLevel, context]
        };
      }
    });
  };
  

  const applyFilter = () => {
    const filtered = convContent.filter((conversation) => {
        const levelMatch = selectedLevels.length === 0 || selectedLevels.includes(conversation.conversationLevel);
        
        // Check if selectedContexts has an entry for the conversation's level
        const contextsForLevel = selectedContexts[conversation.conversationLevel] || [];
        const contextMatch = contextsForLevel.length === 0 || contextsForLevel.includes(conversation.context);
        
        return levelMatch && contextMatch;
    });
    
    setFilteredData(filtered);  // Update the filtered data state
    setFilterVisible(false);    // Close the filter dropdown after applying the filter
};

  

const clearFilter = () => {
  setSelectedLevels([]);
  setSelectedContexts({});
  setSelectedScenarios([]);
  setFilteredData(convContent);
};



  return (
    <motion.div
      className="ConversationMain"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="conversation-header">
        <h1>Conversations</h1>
        {isMenuOpen ? 
          <CustomMenu isOpen={isMenuOpen} className="menuContent" onClose={handleCloseMenu} /> :
          <button className="menuButton" onClick={handleMenuToggle}>
            <FontAwesomeIcon icon={faBars} className="menuIcon" />
          </button>
        }
      </div>
      <div className="conversation-details">
        <p className="conversation-data">Level: {selectedLevel}</p>
        <p className="conversation-data">Context: {selectedSubLevel}</p>
        <p className="conversation-data">Person: {selectedPerson}</p>
      </div>
      { personSelected &&
            <div className="instruction" onClick={() => toggleInstruction()}>
                        <AnimatePresence>
                            <p className="instruction-para">{expandInstruction ?  " Take turns with your partner to say the phrase in the following prompt in the language you are praticing. You are person A so you start. When you complete your phrase let your partner reply and press the next bu on in the prompt to reveal the following phrase you have to say. Tap on the highlighted words for help. Take your me and enjoy the activity!" : "Instructions..."}</p>
                        <span>{expandInstruction ? <Minus />  : <Plus />}</span>
                            
                        </AnimatePresence>
            </div>
        }
      <div className="MainBody">
        {convoSelected === false ? (
          <>
           <h3>Welcome to the LVS Role Play App!</h3>
           <p>Select the level you want to practice</p>
            <div className="customizerButtons">
              <button className="filterbtn" onClick={toggleFilter}><FontAwesomeIcon icon={faFilter} className="menuIcon" />Filter</button>
              <button className="sortbtn"><FontAwesomeIcon icon={faArrowDownWideShort} className="menuIcon" />Sort</button>
              <button className="searchbtn" onClick={toggleSearch}><FontAwesomeIcon icon={faMagnifyingGlass} className="menuIcon" />Search</button>
            </div>


            {/* Filter Function */}
{filterVisible && (
        <div className="filterComp">
          <div className="filterLevel" onClick={toggleLevelDropdown}>
            <p>Filter by level</p>
            <span><ArrowRightIcon /></span>
          </div>

          {showLevelDropdown && (
            <div className="levelDropdown">
              {sortedLevels.map((item, index) => (
    <div key={index} className="levelOption" onClick={() => handleLevelSelection(item)}>
        <input
            type="checkbox"
            checked={selectedLevels.includes(item)}
            onChange={() => handleLevelSelection(item)} 
        />
        <label>{item}</label>
    </div>
))}

            </div>
          )}

          <div className="filterContext" onClick={toggleContextDropdown}>
            <p>Filter by context</p>
            <span><ArrowRightIcon /></span>
          </div>

          {showContextDropdown && selectedLevels.length > 0 && (
  <div className="contextDropdown">
    {selectedLevels.map((level) => (
      <React.Fragment key={level}>
        <p className="contextLevel">{level}</p>
        {[...new Set(
          convContent
            .filter(item => item.conversationLevel === level)
            .map(item => item.context)
        )].map((context, index) => (
          <div key={index} className="contextOption" onClick={() => handleContextSelection(level, context)}>
            <input
              type="checkbox"
              checked={selectedContexts[level] && selectedContexts[level].includes(context)}
              onChange={() => handleContextSelection(level, context)}
            />
            <label>{context}</label>
          </div>
        ))}
      </React.Fragment>
    ))}
  </div>
)}


          <div className="filter-buttons">
            <button className="apply-button" onClick={applyFilter}>Apply Filter</button>
            <button className="clear-filter" onClick={clearFilter}>Clear Filter</button>
          </div>
        </div>
      )}

{/* Search Function */}
{searchVisible && (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="searchBar"
    >
        <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={clearSearch}>Clear</button>

        {/* Display search result count only if search is initiated */}
        {isSearchInitiated && searchCount > 0 && (
            <div className="search-results">
                <span>{searchCount} result(s) found</span>
            </div>
        )}
        {isSearchInitiated && searchCount === 0 && searchQuery !== "" && (
            <div className="search-results">
                <span>No results found for "{searchQuery}"</span>
            </div>
        )}
    </motion.div>
)}

            <div className="LevelsContainer">
            {sortedLevels.map((level, i) => (
                <div className="item" key={i} id={`level-${i}`}>
                    <div className="level" onClick={() => toggleLevel(level)}>
                        <h3>Level {level}</h3>
                        <span>{expandedLevel === level ? <Minus /> : <Plus />}</span>
                    </div>
                    <AnimatePresence>
                        {expandedLevel === level && (
                            <motion.div
                                className="content"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {Object.keys(groupedConversations[level]).map((context, j) => (
                                    <div key={j} className="context" id={`context-${i}-${j}`}>
                                        <div className="context-header" onClick={() => toggleContext(`${level}-${context}`)}>
                                            <p className="context1">{context}</p>
                                            <span>{expandedContext === `${level}-${context}` ? <ArrowDropDownIcon /> : <ArrowRightIcon />}</span>
                                        </div>
                                        <AnimatePresence>
                                            {expandedContext === `${level}-${context}` && (
                                                <motion.div
                                                    className="scenario"
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {groupedConversations[level][context].map((content, k) => (
                                                        <div
                                                            key={k}
                                                            id={`scenario-${i}-${j}-${content.conversationId}`}
                                                            className="scenario1"
                                                            style={{background: selectedConvo === content.scenario ? "#a1eb8f" : "#ebe88f"}} 
                                                            onClick={() => setConvo(level, context, content.scenario, content.conversationId)}
                                                        >
                                                            <p className="scenario-topic">{content.scenario}</p>
                                                            {selectedConvo === content.scenario &&
                                            <FontAwesomeIcon icon={faCheckCircle} className="checkIcon" />}
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
          </>
        ) : (
          !personSelected ? (
            <motion.div className="conversation-body2">
              <div className="ButtonSel">
                <button onClick={() => { setSelectedPerson("A"); setPersonSelected(true); }}>Person A</button>
                <button onClick={() => { setSelectedPerson("B"); setPersonSelected(true); }}>Person B</button>
              </div>
            </motion.div>
          ) : (
            <motion.div className="conversation-body2">
             <div className="ButtonStart">
                <button onClick={() => navigate("/activity-selection/conversation-page/", { state: { 
                  level: selectedLevel, 
                  subLevel: selectedSubLevel, 
                  person: selectedPerson,
                  conversationId: selectedConversationId 
                }})}>
                  Start Conversation
                </button>
              </div>
            </motion.div>
          )
        )}
      </div>
      <Footer />
    </motion.div>
  );
}

export default Conversations;