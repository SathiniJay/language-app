import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/appusers/')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the users!', error);
            });
    }, []);

    return (
        <div>
            <h1>App Users</h1>
            <ul>
                {users.map(user => (
                    <li key={user.userId}>
                        {user.name} - {user.emailAddress}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AppUsers;
