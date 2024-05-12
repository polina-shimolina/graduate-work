import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/UserTeamPage.css'; // Импорт стилей для карточки


const UserTeamPage = () => {
    const [team, setTeam] = useState();
    const [username, setUsername] = useState('');
    const [teamUsers, setTeamUsers] = useState([]);
    const [teamPhotos, setTeamPhotos] = useState([]);

        const fetchTeamPhotos = async (teamId) => {
            try {
                const response = await fetch(`/api/team/${teamId}/photos`);
                if (!response.ok) {
                    throw new Error('Failed to fetch team photos');
                }
                const data = await response.json();
                console.log(data);
                setTeamPhotos(data); 
            } catch (error) {
                console.error('Error fetching team photos:', error);
            }
        };


    const fetchTeamUsers = async () => {
        try {
            const response = await fetch(`/api/team/${team.team_id}/users`);
            if (!response.ok) {
                throw new Error(`Failed to fetch team users for team ${team.team_id}: ${response.status}`);
            }
            const data = await response.json();
            setTeamUsers(data);
        } catch (error) {
            console.error('Error fetching team users:', error);
        }
    };
    
    useEffect(() => {
        if (team) {
            fetchTeamUsers();
            fetchTeamPhotos(team.team_id);
        }
    }, [team]);

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

    
    const handleLeaveTeamClick = async () => {
        try {
            const response = await fetch(`/api/user/${localStorage.getItem('id')}/assign-team`, {
                method: 'DELETE',
                body: JSON.stringify({ team_id: null }),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                }
            });
            if (response.ok) {
                /* const updatedTeamUsers = teamUsers.filter(user => user.user_id !== localStorage.getItem('id'));
                setTeamUsers(updatedTeamUsers); */
                console.log('Вы успешно вышли из команды');
                window.location.reload();
            } else {
                console.error('Ошибка при выходе из команды');
            }
        } catch (error) {
            console.error('Ошибка при обработке запроса:', error);
        }
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
                console.log(userData)

                const teamCheckResponse = await fetch(`/api/user/${userData.id}/team`);
                if (teamCheckResponse.ok) {
                    const teamData = await teamCheckResponse.json();
                    if (teamData.team_id) {
                        console.log(`Пользователь  уже состоите в команде`);
                        return;
                    }
                } else {
                    console.error('Ошибка при проверке наличия команды у пользователя');
                    return;
                }

                if (userData.team_id) {
                    console.log(`Пользователь ${username} уже состоит в команде`);
                    return;
                }
                const assignTeamResponse = await fetch(`/api/user/${userData.id}/team/`, {
                    method: 'POST',
                    body: JSON.stringify({ team_id: team.team_id }),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                });
                if (assignTeamResponse.ok) {
                    console.log(`Пользователь ${username} добавлен в команду`);
                    window.location.reload();
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
            <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h2>Ты в команде "{team.team_name}"</h2>
                        <p>Автор: {team.team_creator}</p>
                        <p>{team.description}</p>
                    </div>
                    <div>
                        <input type="text" placeholder="Введите юзернейм" value={username} onChange={handleUsernameChange} />
                        <button className="btn btn-primary ml-2" onClick={handleInviteClick}>Пригласить в команду</button>
                        <button className="btn btn-danger ml-2" onClick={handleLeaveTeamClick}>Выйти из команды</button>
                    </div>
                </div>
                <div>
                    <h3>Наша команда:</h3>
                    <ul>
                        {teamUsers.map(user => (
                            <li key={user.user_id}>{user.user__username} - {user.user__email}</li>                        ))}
                    </ul>
                </div>
                <div>
    <h3>Наша галерея:</h3>
    {teamPhotos.length > 0 ? (
        <div className="row">
            {teamPhotos.map(photo => (
                <div key={photo.id} className="col-md-4 mb-3">
                    <div className="card">
                        <img src={photo.segmented_photo.image_url} className="card-img-top" alt="Photo" />
                        <div className="card-body">
                            <h5 className="card-title">Uploaded by: {photo.owner.username}</h5>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    ) : (
        <p>Твоя команда пока не добавила ни одного изображения( Воспользуйся чекбоксом на странце "<a href="/photos" className="try-link">Попробовать</a>", чтобы добавить изображение на странцу команды.</p>
    )}
</div>
            </div>
        )}
    </div>
);
};

export default UserTeamPage;
