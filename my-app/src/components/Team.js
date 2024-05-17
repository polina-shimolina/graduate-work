import React, { useState, useEffect } from 'react';
import UserTeamPage from './UserTeamPage';
import NoTeamPage from './NoTeamPage';

const Team = ({ isAuthenticated }) => {
    const [hasTeam, setHasTeam] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    '/api/user/',
                    {
                    headers: {
                      'Content-Type': 'application/json;charset=utf-8',
                      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                  }
                );
                
                const data = await response.json();
                if (data.data.profile.team !== null) {
                    setHasTeam(true);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container mt-4">
            {isAuthenticated ? (hasTeam ? <UserTeamPage /> : <NoTeamPage />) : <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p>Тебе нужно войти в свой аккаунт прежде чем начать работать в команде</p>
        </div>}
        </div>
    );
};

export default Team;
