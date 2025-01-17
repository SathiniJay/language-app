// src/pages/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/loginPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faApple, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; 

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log({
            email,
            password
        });
        try {
            const response = await axios.post('http://localhost:8000/api/accounts/login/', {
                email,
                password
            });
            setError('');
            alert('Login successful');
            
            // Store the token in local storage
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('userEmail', email); 
            
            // Redirect to home page
            navigate('/home');
        } catch (error) {
            let errorMessage = 'Login failed: An unknown error occurred';

            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = `Login failed: ${error.response.data.error}`;
            } else if (error.message) {
                errorMessage = `Login failed: ${error.message}`;
            }

            setError(errorMessage);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>Welcome!</h1>
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
                <div className='forgotPass'>
                    <Link to="/forgot-password">Forgot Password?</Link>
                </div>
                <div className="login">
                    <button className="social-button signup-button" type="submit">Login</button>
                    {error && <p>{error}</p>}
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
                    <button className="social-button signup-button" onClick={() => navigate('/signup')}>Sign up</button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
