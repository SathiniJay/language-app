import React, { useState, useEffect } from 'react';
import '../styles/languagesPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faLanguage } from '@fortawesome/free-solid-svg-icons';
import CustomMenu from '../components/customMenu';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Footer from '../components/footer';

const LanguagesPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail')); 

  // Fetch languages from the API
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/languages/');
        const data = await response.json();
        setLanguages(data); 
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    fetchLanguages();
  }, []);

  // Fetch the user's selected language
  useEffect(() => {
    const fetchUserLanguage = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/appusers/email/${userEmail}/`);
        const data = await response.json();
        if (data.languageId) {
          setSelectedLanguage(data.languageId);
        }
      } catch (error) {
        console.error('Error fetching user language:', error);
      }
    };

    fetchUserLanguage();
  }, [userEmail]);

  // Handle menu toggle
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle language selection
  const handleChange = (langId) => {
    setSelectedLanguage(langId); 
  };

  // Save the selected language to the database
  const handleSave = async () => {
    if (!selectedLanguage) {
      alert('Please select a language before saving.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/appusers/email/${userEmail}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          languageId: selectedLanguage, 
        }),
      });

      if (response.ok) {
        alert('Language selection updated successfully!');
      } else {
        const errorData = await response.json(); 
        alert(`Error updating language selection: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error('Error saving language selection:', error);
    }
  };

  return (
    <div className="languages-container">
      <header className="languages-header">
        <h1>Languages</h1>
        {isMenuOpen ? 
          <CustomMenu isOpen={isMenuOpen} className="menuContent" onClose={handleCloseMenu} /> :
          <button className="menuButton" onClick={handleMenuToggle}>
            <FontAwesomeIcon icon={faBars} className="menuIcon" />
          </button>
        }
      </header>
      <div className="profile-picture"></div>
      <div className="info-card">
        <FontAwesomeIcon icon={faLanguage} className="icon" />
        <div>
          <h3>Language</h3>
        </div>
      </div>
      <div className="select-language">
        <FontAwesomeIcon icon={faLanguage} className="icon" />
        <h3>Select language to practice</h3>
        <div className="language-options">
          <div className="language-list">
            {languages.map(lang => (
              <li key={lang.languageId} className="language-item">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedLanguage === lang.languageId}
                    onChange={() => handleChange(lang.languageId)} 
                  />
                  {selectedLanguage === lang.languageId ? (
                    <CheckBoxIcon className="custom-checkbox" />
                  ) : (
                    <CheckBoxOutlineBlankIcon className="custom-checkbox" />
                  )}
                  {lang.languageName}
                </label>
              </li>
            ))}
          </div>
        </div>
        <button className="save-button" onClick={handleSave}>
        <h3>Save Changes</h3>
      </button>
      </div>
      <Footer/>
    </div>
  );
};

export default LanguagesPage;
