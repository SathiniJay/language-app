import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/footer";
import "../styles/InformationGapExercise.css";

function JoinSession() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get passed state values from the previous page
  const { person, type, level, subLevel, infoGapExerciseId } = location.state || {};

  // State to handle session creation/joining
  const [sessionCode, setSessionCode] = useState("");        // For Person B: session code input
  const [generatedCode, setGeneratedCode] = useState("");    // For Person A: generated session code
  const [error, setError] = useState("");                    // To show error messages
  const [isWaiting, setIsWaiting] = useState(false);         // Show waiting status after code generation
  const [partnerJoined, setPartnerJoined] = useState(false); // Track if the other person has joined

  // Person A: create a session code
  const handleCreate = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/create-session/", {
        infoGapExerciseId,
      });
      setGeneratedCode(response.data.session_code);
      setIsWaiting(true); // Start polling for partner
    } catch (err) {
      setError("Failed to create session.");
    }
  };

  // Person B: join session with a given code
  const handleJoin = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/join-session/", {
        sessionCode,
        infoGapExerciseId,
      });

      let path = "";
      switch (parseInt(infoGapExerciseId)) {// Path to the appropriate exercise screen based on ID
        case 1:
          path = "/activity-selection/information-gap/lists/infoGapListDeli";
          break;
        case 2:
          path = "/activity-selection/information-gap/maps/InfoGapMapTownCentre";
          break;
        case 3:
          path = "/activity-selection/information-gap/matrices/infoGapMatricesInterview";
          break;
        default:
          path = "/activity-selection/information-gap-exercise";
      }

      // Navigate to exercise screen with session context
      navigate(path, {
        state: {
          person,
          type,
          level,
          subLevel,
          infoGapExerciseId,
          sessionCode: sessionCode, //pass sessionCode to exercise page for the syncing (B)
        },
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to join session.");
    }
  };

  // Person A: start polling to check if Person B has joined
  useEffect(() => {
    let interval;
    if (isWaiting && generatedCode) {
      interval = setInterval(async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/sessions/${generatedCode}/status/`);
          if (response.data.person_b_joined) {
            clearInterval(interval);
            setPartnerJoined(true);// B has joined, enable Start button
          }
        } catch (error) {
          console.error("Polling error:", error);
        }
      }, 3000);// Poll every 3 seconds
    }
    return () => clearInterval(interval);
  }, [isWaiting, generatedCode]);

  // When A detects B has joined, they start the exercise
  const handleStart = () => {
    let path = "";
    switch (parseInt(infoGapExerciseId)) {
      case 1:
        path = "/activity-selection/information-gap/lists/infoGapListDeli";
        break;
      case 2:
        path = "/activity-selection/information-gap/maps/InfoGapMapTownCentre";
        break;
      case 3:
        path = "/activity-selection/information-gap/matrices/infoGapMatricesInterview";
        break;
      default:
        path = "/activity-selection/information-gap-exercise";
    }

    navigate(path, {
      state: {
        person,
        type,
        level,
        subLevel,
        infoGapExerciseId,
        sessionCode: generatedCode, //pass sessionCode from created session to exercise page for the syncing (A)
      },
    });
  };

  return (
    <div className="InfoGapExerciseMain">
      <div className="infoGapExercise-header">
        <h1>Join Session</h1>
      </div>

      {/* Display selected exercise info */}
      <div className="infoGapExercise-details">
        <p className="infoGapExercise-data">Level: {level}</p>
        <p className="infoGapExercise-data">Context: {subLevel}</p>
        <p className="infoGapExercise-data">Person: {person}</p>
      </div>
      {/* Main session interaction area */}
      <div className="infoGapExercise-body2">
        <h2>Hello, Person {person}</h2>

        {person === "A" ? (//If Person A, show generate session code and waiting until B joins
          <div>
            <button onClick={handleCreate} disabled={isWaiting}>Generate Session Code</button>
            {generatedCode && (
              <p>
                Share this code with your partner: <strong>{generatedCode}</strong>
              </p>
            )}
            {isWaiting && !partnerJoined && <p>Waiting for Person B to join...</p>}
            {partnerJoined && <button onClick={handleStart}>Start</button>}
          </div>
        ) : ( // If Person B, show input to join using code
          <div>
            <input
              type="text"
              placeholder="Enter Session Code"
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value)}
            />
            <button onClick={handleJoin}>Join Session</button>
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      <Footer />
    </div>
  );
}

export default JoinSession;