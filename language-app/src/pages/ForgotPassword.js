// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/ForgotPassword.css';
import Footer from '../components/footer';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/accounts/reset_password/', { email });
            setMessage('Password reset link has been sent to your email.');
            setError('');
        } catch (error) {
            let errorMessage = 'An unknown error occurred';
            if (error.response && error.response.data) {
                errorMessage = error.response.data.error || errorMessage;
            }
            setError(errorMessage);
            setMessage('');
        }
    };

    return (
        <div className='forgotpass-container'>
            <form className='forgotpass-form' onSubmit={handleSubmit}>
            <h2>Forgot Password</h2>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="login">
                <button className= "social-button signup-button" type="submit">Send Verification Email</button>
                {message && <p>{message}</p>}
                {error && <p>{error}</p>}
        </div>
        <p><Link to="/login">Back to Login</Link></p>
            </form>
        <Footer/>
        </div>
    );
};

export default ForgotPassword;
