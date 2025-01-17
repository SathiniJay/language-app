import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import "../styles/ConversationPage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomMenu from '../components/customMenu';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Plus from '@material-ui/icons/ControlPoint';
import Minus from '@material-ui/icons/RemoveCircleOutline';
import axios from 'axios';
import Footer from '../components/footer';

function ConversationPage() {
    const [conversationData, setConversationData] = useState([]);
    const [hintsData, setHintsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleDialogueIndex, setVisibleDialogueIndex] = useState(0);
    const [showFullConversation, setShowFullConversation] = useState(false);
    const [selectedHint, setSelectedHint] = useState(null);
    const [selectedHintTranslation, setSelectedHintTranslation] = useState('');
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [userLanguage, setUserLanguage] = useState(null); 
    const [userLanguageName, setUserLanguageName] = useState(''); 
    const [languages, setLanguages] = useState([]);
    const [hasReachedEnd, setHasReachedEnd] = useState(false); 
    

    const navigate = useNavigate();
    const location = useLocation();
    const popupRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleCloseMenu = () => {
        setIsMenuOpen(false);
    };

    const [expandInstruction, setExpandInstruction] = useState(false);
    
    const toggleInstruction = () => {
        setExpandInstruction(!expandInstruction);
    };

    const { level, subLevel, person, conversationId } = location.state || { name: 'Unknown' };

    useEffect(() => {
        const fetchUserLanguage = async () => {
            const userEmail = localStorage.getItem('userEmail'); 
            try {
                const response = await axios.get(`http://localhost:8000/api/appusers/email/${userEmail}/`);
                setUserLanguage(response.data.languageId); 
            } catch (err) {
                console.error('Error fetching user language:', err);
            }
        };

        const fetchLanguages = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/languages/');
                setLanguages(response.data); 
            } catch (err) {
                console.error('Error fetching languages:', err);
            }
        };

        const fetchConversationData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/conversationcontents/', {
                    params: { conversationId }
                });
                setConversationData(response.data);
                fetchHintsData();
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchUserLanguage(); 
        fetchLanguages(); 
        fetchConversationData(); 
    }, [conversationId]);

    useEffect(() => {
        const fetchLanguageNameAndHints = async () => {
            if (userLanguage) {
                const language = languages.find(lang => lang.languageId === userLanguage);
                if (language) {
                    setUserLanguageName(language.languageName); // Save the language name
                    await fetchHintsData(language.languageName); // Fetch hints with the corresponding language name
                }
            }
        };
    
        fetchLanguageNameAndHints();
    }, [userLanguage, languages]);
    
    const fetchHintsData = async (languageName) => {
        if (!languageName) return; 
        try {
            const response = await axios.get(`http://localhost:8000/api/hints/`, {
                params: { languageName } 
            });
            setHintsData(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    const handleNextDialogue = () => {
        if (visibleDialogueIndex < conversationData.length - 1) {
            setVisibleDialogueIndex(visibleDialogueIndex + 1);
        } else {
            setHasReachedEnd(true); 
        }
    };

    const handleRepeatDialogue = () => {
        setVisibleDialogueIndex(0);
        setShowFullConversation(false); 
    };

    const handleRevealDialogue = () => {
        setShowFullConversation(true); 
        handleSaveProgress();
    };

    const handleWordClick = (event, word) => {
        const rect = event.target.getBoundingClientRect();
        setPosition({ x: rect.left, y: rect.top + window.scrollY + rect.height });
    
        const hint = hintsData.find(hint => hint.word.toLowerCase() === word.toLowerCase());
        if (hint) {
            setSelectedHint(word);
    
            // Access the translation based on the user language name
            const translation = hint[userLanguageName.toLowerCase()] || hint.spanish; 
            setSelectedHintTranslation(translation); 
        }
    };
    
    

    const closePopup = () => {
        setSelectedHint(null);
        setSelectedHintTranslation(''); 
    };

    const highlightWords = (dialogue, contentId) => {
        // Ensure dialogue is a string
        if (typeof dialogue !== 'string') {
            console.error('Dialogue is not a string:', dialogue);
            return <span>{dialogue}</span>; 
        }
    
        // Filter hints based on contentId
        const hintsForContent = hintsData.filter(hint => hint.contentId === parseInt(contentId, 10));
    
        // Return dialogue as is if no hints
        if (hintsForContent.length === 0) {
            return <span>{dialogue}</span>;
        }
    
        let highlightedDialogue = dialogue;
    
        // Loop through each hint to highlight words
        hintsForContent.forEach(hint => {
            const word = hint.word;

            if (typeof word !== 'string') {
                console.error('Invalid hint word:', word);
                return; 
            }
    
            // Avoid using empty regex patterns
            if (word.trim() === '') {
                console.error('Empty hint word:', word);
                return;
            }
    
            try {
                const regex = new RegExp(`\\b(${word})\\b`, 'gi');
                highlightedDialogue = highlightedDialogue.split(regex).map((part, index) =>
                    hintsForContent.some(h => h.word.toLowerCase() === part.toLowerCase()) ?
                    <span 
                        key={index} 
                        className="highlight-yellow" 
                        onClick={(event) => handleWordClick(event, word)}
                    >
                        {part}
                    </span> :
                    part
                );
            } catch (err) {
                console.error('Error creating regex for word:', word, err);
            }
        });
    
        return <span>{highlightedDialogue}</span>;
    };
    
    const handleSaveProgress = async () => {
        const userEmail = localStorage.getItem('userEmail');  
        const languageId = parseInt(userLanguage);  
        const conversation = parseInt(conversationId); 
        const person = location.state?.person || 'A';  
    
        try {
            // Prepare the new progress data to be saved
            const progressData = {
                user: userEmail,  
                language: languageId,  
                conversation: conversation,  
                person: person,  
                completed_times: 1,  
            };
    
            // Post the progress data to the API
            const response = await axios.post('http://localhost:8000/api/progress/', progressData, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('authToken')}`,  // Auth token for protected endpoint
                    'Content-Type': 'application/json',
                },
            });
    
            // If save is successful, show a success alert
            if (response.status === 201) {
                alert('Progress saved successfully!');  
                setShowFullConversation(true);  
            }
        } catch (error) {
            console.error('Error saving progress:', error);  
            alert('Error saving progress. Please try again.');  // Error message for the user
        }
    };
    
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching data: {error.message}</div>;

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
                <p className="conversation-data">Level: {level}</p>
                <p className="conversation-data">Context: {subLevel}</p>
                <p className="conversation-data">Person: {person}</p>
            </div>
            <div className="instruction" onClick={toggleInstruction}>
                <AnimatePresence>
                    <p className="instruction-para">
                        {expandInstruction 
                            ? "Take turns with your partner to say the phrase in the following prompt in the language you are practicing. You are person A so you start. When you complete your phrase let your partner reply and press the next button in the prompt to reveal the following phrase you have to say. Tap on the highlighted words for help. Take your time and enjoy the activity!"
                            : "Instructions..."
                        }
                    </p>
                    <span className="instruction-expand-icon">
                        {expandInstruction ? <Minus /> : <Plus />}
                    </span>
                </AnimatePresence>
            </div>
            <div className="MainBody">
    {!showFullConversation ? (
        <div>
            {conversationData.length === 0 ? (
                <div>No data found for this Conversation ID.</div>
            ) : (
                conversationData
                    // Filter dialogues to only show those of the selected person
                    .filter((item) => item.person === person)
                    .slice(0, visibleDialogueIndex + 1)
                    .map((item, index) => {
                        const dialogueContent = item.prompt;

                        // Highlight words in the dialogue based on contentId
                        const highlightedContent = highlightWords(dialogueContent, item.contentId);

                        return (
                            <div 
                                className={`dialouge ${item.person === 'B' ? 'person-b-container' : ''}`} 
                                key={index}
                            >
                                <p className="dialouge-number">{item.person}</p>
                                <div key={index} className={`conversation-item ${index === visibleDialogueIndex ? 'current-dialouge' : 'old-dialouge'}`}>
                                    <p className='dialouge-content'>{highlightedContent}</p>
                                    {index === visibleDialogueIndex && visibleDialogueIndex < conversationData.filter(item => item.person === person).length - 1 && (
                                        <button 
                                            className="next-btn" 
                                            onClick={handleNextDialogue}
                                        >
                                            <span className="arrow">→</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
            )}
            <div className='bottom-btns'>
                <button 
                    onClick={handleRepeatDialogue} 
                    className="repeat-dialogue"
                    disabled={visibleDialogueIndex < conversationData.filter(item => item.person === person).length - 1}
                >
                    Repeat dialogue
                </button>
                <button 
                    onClick={() => navigate('/activity-selection/conversations')} 
                    className="select-new-context"
                >
                    Select new context
                </button>
                {visibleDialogueIndex >= conversationData.filter(item => item.person === person).length - 1 && (
                    <button 
                        onClick={handleRevealDialogue} 
                        className="reveal-dialogue"
                    >
                        Reveal dialogue
                    </button>
                )}
            </div>
        </div>
    ) : (
        // Show the full conversation when "Reveal Dialogue" is clicked
        <div className="conversation">
            {conversationData.map((item, index) => (
                <div 
                    className={`dialouge ${item.person === 'B' ? 'person-b-container' : ''}`} 
                    key={index}
                >
                    <p className="dialouge-number">{item.person}</p>
                    <div 
                        key={index} 
                        className={`conversation-item ${item.person === 'A' ? 'person-a' : 'person-b'}`}
                    >
                        <p className='dialouge-content'>{item.line}</p>
                    </div>
                </div>
            ))}
            <div className='bottom-btns'>
                <button 
                    onClick={() => setShowFullConversation(false)} 
                    className="back-to-dialogue"
                >
                    Back to dialogue
                </button>
            </div>
        </div>
    )}

</div>

{selectedHint && (
    <div 
        className="popup-box" 
        ref={popupRef} 
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
        <p>{selectedHintTranslation}</p>
        <button onClick={closePopup} className="close-popup">X</button>
    </div>
)}
<Footer/>
        </motion.div>
    );
}

export default ConversationPage;
