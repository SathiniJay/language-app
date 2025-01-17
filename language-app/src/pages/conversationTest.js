import React, { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Plus from '@material-ui/icons/ControlPoint';
import Minus from '@material-ui/icons/RemoveCircleOutline';
import Footer from "../components/footer";

const ConversationTest = () => {
    const [convContent, setConvContent] = useState([]);
    const [expandedLevel, setExpandedLevel] = useState(null);
    const [expandedContext, setExpandedContext] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/api/conversations/')
            .then(response => {
                setConvContent(response.data);
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

    const groupedConversations = groupByLevelAndContext(convContent);
    const sortedLevels = Object.keys(groupedConversations).sort();

    const toggleLevel = (level) => {
        setExpandedLevel(expandedLevel === level ? null : level);
    };

    const toggleContext = (context) => {
        setExpandedContext(expandedContext === context ? null : context);
    };

    return (
        <div className="LevelsContainer">
            <h1>Conversation Test View</h1>
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
                                            <p className="context1">Context: {context}</p>
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
                                                        >
                                                            <p className="scenario-topic">{content.scenario}</p>
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
        <Footer/>
        </div>
    );
};

export default ConversationTest;
