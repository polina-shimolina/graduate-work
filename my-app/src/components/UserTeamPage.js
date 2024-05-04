import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/UserTeamPage.css'; // Импорт стилей для карточки

const UserTeamPage = () => {
    const [team, setTeam] = useState(null);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const fetchTeamData = async () => {
        try {
            const response = await fetch(`/api/user/${localStorage.getItem('id')}/team`);
            if (!response.ok) {
                throw new Error(`Failed to fetch team data for user ${localStorage.getItem('id')}: ${response.status}`);
            }
            const data = await response.json();
            setTeam(data);
            console.log(data)
            console.log(data.creator)
        } catch (error) {
            console.error('Error fetching team data:', error);
        }
    };

    useEffect(() => {
        fetchTeamData();
    }, []);

    const handleCardClick = () => {
        console.log('Переход на другую страницу');
        navigate('/photos');
    };

    const handleInviteClick = async () => {
        if (!username) {
            console.log('Введите юзернейм пользователя');
            return;
        }

        try {
            const response = await fetch(`/api/user/${username}`);
            if (response.ok) {
                const userData = await response.json();
                const assignTeamResponse = await fetch(`/api/user/${userData.id}/assign-team`, {
                    method: 'POST',
                    body: JSON.stringify({ team_id: team.team_id }),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                });
                if (assignTeamResponse.ok) {
                    console.log(`Пользователь ${username} добавлен в команду`);
                    // Обновить состояние или показать уведомление об успешном приглашении
                } else {
                    console.error('Ошибка при назначении команды пользователю');
                }
            } else {
                console.error('Пользователь с таким юзернеймом не найден');
            }
        } catch (error) {
            console.error('Ошибка при обработке запроса:', error);
        }
    };

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    return (
        <div className="container mt-4">
            {team && (
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h2>Ты в команде "{team.team_name}"</h2>
                        <p>Автор: {team.team_creator}</p>
                        <p>{team.description}</p>
                    </div>
                    <div>
                        <input type="text" placeholder="Введите юзернейм" value={username} onChange={handleUsernameChange} />
                        <button className="btn btn-primary ml-2" onClick={handleInviteClick}>Пригласить в команду</button>
                        <button className="btn btn-danger ml-2">Выйти из команды</button>
                    </div>
                </div>
            )}
            <div className="card mt-3" onClick={handleCardClick}>
                <div className="card-body card-hover" onClick={handleCardClick}>
                    <p className="card-text">Здесь будет изображение</p>
                    <p className="card-text">Автор: Автор изображения</p>
                </div>
            </div>
        </div>
    );
};

export default UserTeamPage;
