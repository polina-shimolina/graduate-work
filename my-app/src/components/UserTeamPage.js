import React, { useState, useEffect } from 'react';
import './style/UserTeamPage.css'; // Импорт стилей для карточки
import { Card, Form, Button } from 'react-bootstrap'; // Импортируем компоненты Card, Form и Button из react-bootstrap
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Импортируем компонент FontAwesomeIcon из Font Awesome
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'; // Импортируем иконку для кнопки отправки

const UserTeamPage = () => {
    const [team, setTeam] = useState();
    const [username, setUsername] = useState('');
    const [teamUsers, setTeamUsers] = useState([]);
    const [teamPhotos, setTeamPhotos] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [commentsTexts, setCommentsTexts] = useState({});

    const handleCommentTextChange = (photoId, text) => {
        setCommentsTexts(prevState => ({
            ...prevState,
            [photoId]: text
        }));
    };

    const fetchTeamPhotos = async () => {
        try {
            const response = await fetch(`/api/team/${team.team_id}/photos`);
            if (!response.ok) {
                throw new Error('Failed to fetch team photos');
            }
            const data = await response.json();
            console.log(data);
            setTeamPhotos(data); 
            data.forEach(photo => {
                fetchPhotoComments(photo.id);
            });
        } catch (error) {
            console.error('Error fetching team photos:', error);
        }
    };

    const fetchPhotoComments = async (teamphotosId) => {
        try {
            const response = await fetch(`/api/userphoto/${teamphotosId}/comments/`);
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            const commentsData = await response.json();
            console.log(commentsData);
        
            const updatedComments = {};
            commentsData.forEach(comment => {
                if (!updatedComments[comment.team_photo]) {
                    updatedComments[comment.team_photo] = [];
                }
                updatedComments[comment.team_photo].push(comment);
            });
        
            setComments(updatedComments);
        } catch (error) {
            console.error('Error fetching comments:', error);
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
            fetchTeamPhotos();
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
            const response = await fetch(`/api/user/${localStorage.getItem('id')}/team`, {
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
                        console.log(`Пользователь уже состоит в команде`);
                        alert('Пользователь уже состоит в команде.');
                        return;
                    }
                } else {
                    console.error('Ошибка при проверке наличия команды у пользователя');
                    return;
                }

                if (userData.team_id) {
                    alert(`Пользователь ${username} уже состоит в команде`);
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

    const updateCommentsList = async () => {
        const commentsResponse = await fetch('/api/comments/');
        const commentsData = await commentsResponse.json();
    };

    const handleCommentSubmit = async (teamphotoId, commentText) => {
        const authorId = parseInt(localStorage.getItem('id'))
        const userResponse = await fetch(`/api/user/${authorId}/`);
        const userData = await userResponse.json();
        console.log(userData)
        const commentData = {
            text: commentText,
            team_photo: teamphotoId,
            author: authorId
        };

        console.log(commentData)
        try {
            
            const response = await fetch(`/api/userphoto/${teamphotoId}/comments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit comment');
            }
    
            console.log('Комментарий успешно отправлен');
            fetchTeamPhotos();
            setCommentText('');
            teamPhotos.forEach(photo => {
                fetchPhotoComments(photo.id);
            });
    
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
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
                    <Card style={{ width: '24rem' }}>
                        <Card.Img variant="top" src={photo.user_photo.segmented_photo.photo} style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }} />
                        <Card.Body>
                            <Card.Text>
                                Uploaded by: {photo.user_photo.user.username}
                            </Card.Text>
                            {comments[photo.id] && comments[photo.id].map(comment => (
                                <div key={comment.id} style={{ marginBottom: '10px', padding: '5px', border: '1px solid #ccc' }}>
                                    <div>{comment.text}</div>
                                    <div style={{ fontSize: '12px', color: 'gray' }}>
                                        Оставлено {new Date(comment.publication_datetime).toLocaleString()} пользователем {comment.author.username}
                                    </div>
                                </div>
                            ))}
                            <Form.Group style={{ display: 'flex', alignItems: 'center' }}>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Add a comment" 
                                    style={{ marginRight: '10px' }} 
                                    value={commentsTexts[photo.id] || ''} // Обновленное состояние для текста комментария
                                    onChange={(e) => handleCommentTextChange(photo.id, e.target.value)} // Изменение текста комментария
                                />
                                <Button variant="primary" onClick={() => handleCommentSubmit(photo.id, commentsTexts[photo.id])}>
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </Button>                            </Form.Group>
                        </Card.Body>
                    </Card>
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
