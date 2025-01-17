import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCog } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import CustomMenu from '../components/customMenu';
import '../styles/settingsPage.css';
import Footer from '../components/footer';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Settings = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('********');
  const [joinedDate, setJoinedDate] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Handle the menu toggle
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        // Fetch user profile data
        const profileResponse = await axios.get('http://localhost:8000/api/accounts/profile/', {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`,
          },
        });
  
        const { email, username, joined_date } = profileResponse.data;
        setEmail(email);
        setUsername(username);
        setJoinedDate(joined_date);
  
        // Fetch birthday from AppUsers endpoint
        const birthdayResponse = await axios.get(`http://localhost:8000/api/appusers/email/${email}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`,
          },
        });
  
        const { birthDate } = birthdayResponse.data; 
        console.log(birthDate)
        if (birthDate) {
          const [year, month, day] = birthDate.split('-'); 
          setBirthYear(year);
          setBirthMonth(months[parseInt(month, 10) - 1]); 
          setBirthDay(day);
        }
  
      } catch (err) {
        setError('Failed to load settings data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchSettingsData();
  }, []);
  

  // Update user profile (username and password)
  const handleUpdateProfile = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/accounts/profile/', 
        { username, password },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`,
          },
        }
      );

      alert('Profile details updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  // Update birthday
  const handleUpdateBirthday = async () => {
    try {
      // Prepare the birthday in YYYY-MM-DD format
      const monthIndex = months.indexOf(birthMonth) + 1; 
      const birthday = `${birthYear}-${monthIndex < 10 ? '0' + monthIndex : monthIndex}-${birthDay < 10 ? '0' + birthDay : birthDay}`;
  
      const response = await axios.put(
        `http://localhost:8000/api/appusers/email/${email}/`, 
        {
          birthDate: birthday, 
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`,
          },
        }
      );

      alert('Birthday updated successfully!');
    } catch (err) {
      console.error('Error updating birthday:', err);
      setError('Failed to update birthday');
    }
  };
  

  const handleSaveChanges = async () => {
    await handleUpdateProfile(); // Update username and password
    await handleUpdateBirthday(); // Update birthday
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        {isMenuOpen ? 
          <CustomMenu isOpen={isMenuOpen} className="menuContent" onClose={handleCloseMenu} /> :
          <button className="menuButton" onClick={handleMenuToggle}>
            <FontAwesomeIcon icon={faBars} className="menuIcon" />
          </button>
        }
      </div>
      <div className="profile-section">
        <div className="settings-profile-picture"></div>
      </div>
      <div className="info-card">
        <FontAwesomeIcon icon={faCog} className="icon" />
        <div>
          <h3>Settings</h3>
        </div>
      </div>
      <form className="settings-form">
        <TextField
          label="Email Address"
          value={email}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
          variant="outlined"
        />
        <TextField
          label="Username"
          value={username}
          fullWidth
          margin="normal"
          variant="outlined"
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          value={password}
          fullWidth
          margin="normal"
          variant="outlined"
          helperText="Password should contain at least 8 characters"
          onChange={(e) => setPassword(e.target.value)} 
        />
        <div className="birth-date-section">
          <label>Birth Date [Optional]</label>
          <div className="birth-date-inputs">
          <TextField
            type="number"
            value={birthDay}
            onChange={(e) => setBirthDay(e.target.value)} // Update the day state
            variant="outlined"
            inputProps={{ min: 1, max: 31 }}
          >
          </TextField>

            <TextField
              select
              value={birthMonth}
              onChange={(e) => setBirthMonth(e.target.value)} // Update the month state
              variant="outlined"
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="number"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)} // Update the year state
              variant="outlined"
              inputProps={{ min: 1900, max: new Date().getFullYear() }}
            />
          </div>
        </div>
        <Button color="primary" className="saveChanges" onClick={handleSaveChanges}>SAVE CHANGES</Button>
        <div className="join-date">
          <span>Joined {joinedDate}</span>
        </div>
      </form>
      <Footer/>
    </div>
  );
};

export default Settings;
