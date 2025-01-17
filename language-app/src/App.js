import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/landingPage';
import Info from './pages/infoPage';
import Login from './pages/loginPage';
import Signup from './pages/signupPage';
import Home from './pages/homePage';
import Profile from './pages/profilePage';
import Progress from './pages/progressPage';
import Language from './pages/languagesPage';
import Settings from './pages/settingsPage';
import ActivitySelection from './pages/ActivitySelection';
import Conversations from './pages/Conversation';
import ConversationPage from './pages/ConverstaionPage';
import InformationGap from './pages/InformationGap';
import Test from './pages/test';
import ConversationTest from './pages/conversationTest';
import ForgotPassword from './pages/ForgotPassword';
import Credits from './pages/credits';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/info" element={<Info />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/language" element={<Language />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/activity-selection" element={<ActivitySelection />} />
        <Route path="/activity-selection/conversations" element={<Conversations />} />
        <Route path="/activity-selection/information-gap" element={< InformationGap/>} />
        <Route path="/activity-selection/conversation-page" element={< ConversationPage/>} />
        <Route path="/test" element={<Test />} />
        <Route path="/convTest" element={<ConversationTest/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/credits" element={<Credits />} />
      </Routes>
    </Router>
  );
}

export default App;
