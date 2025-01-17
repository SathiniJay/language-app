import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SignupPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faApple, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom'; 

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate password and confirm password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/accounts/register/', {
        username,
        email,
        password,
      });

      const { token } = response.data; // Get the token from the response
      localStorage.setItem('authToken', token);
      localStorage.setItem('userEmail', email); 
      
      setError('');
      alert('Registration successful');

      try {
        await axios.post('http://localhost:8000/api/appusers/', {
          emailAddress: email,
          languageId: 8, 
        }, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        alert('User created in AppUsers with default language');
      } catch (error) {
        console.error('Error creating AppUsers entry:', error.response?.data);
        setError('User registration was successful, but there was an issue setting default language.');
      }

      // Navigate to the home page after successful registration and AppUsers entry
      navigate('/home');
    } catch (error) {
      let errorMessage = 'Registration failed: An unknown error occurred';

      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = `Registration failed: ${error.response.data.error}`;
      } else if (error.message) {
        errorMessage = `Registration failed: ${error.message}`;
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1>Welcome!</h1>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="divider"></div> or <div className="divider"></div>
        <div className="social-buttons">
          <button className="social-button google-button">
            <FontAwesomeIcon icon={faGoogle} className="icon" /> Google
          </button>
          <button className="social-button apple-button">
            <FontAwesomeIcon icon={faApple} className="icon" /> Apple
          </button>
          <button className="social-button facebook-button">
            <FontAwesomeIcon icon={faFacebook} className="icon" /> Facebook
          </button>
        </div>
        <div className="sign">
          <button className="social-button signup-button" type="submit">Create Account</button>
          {error && <p>{error}</p>}
        </div>
        <p>
          Already have an account? <Link to="/login" className="login-link">Log In</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
