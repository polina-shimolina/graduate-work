import React, { useState } from 'react';

const NoTeamPage = () => {
    const [teamName, setTeamName] = useState('');
    const [teamDescription, setTeamDescription] = useState('');

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const handleCreateTeam = () => {
        const currentDate = new Date().toISOString().split('T')[0]; 
        const userId = localStorage.getItem('id'); 
        const data = {
            teamname: teamName,
            description: teamDescription,
            created_at: currentDate,
            creator: userId,
        };

        fetch('/api/team/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Ошибка при создании команды');
        })
        .then(data => {
            console.log('Коsманда успешно создана:', data);
            console.log(data.id)
            // Добавляем ID команды в поле 'team' пользователя
            fetch(`/api/user/${userId}/assign-team`, {
                method: 'POST',
                body: JSON.stringify({ team_id: data.team_id }),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                
            })
            .then(response => {
                if (response.ok) {
                    console.log('ID команды успешно добавлен в поле team пользователя');
                    window.location.reload();
                } else {
                    throw new Error('Ошибка при обновлении поля team пользователя');
                }
            })
            .catch(error => {
                console.error('Ошибка при обновлении поля team пользователя:', error);
            });

        })
        .catch(error => {
            console.error('Ошибка при создании команды:', error);
        });
    };

    return (
        <div className="container text-center mt-4">
            <h2>Вы не состоите в команде</h2>
            <p>Создайте новую команду или дождитесь приглашения</p>
            <div style={{ maxWidth: '230px', margin: '0 auto' }}>
                <input type="text" placeholder="Введите название команды" value={teamName} onChange={(e) => setTeamName(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
                <textarea placeholder="Введите описание команды" value={teamDescription} onChange={(e) => setTeamDescription(e.target.value)} style={{ width: '100%', padding: '8px', minHeight: '80px' }} />
            </div>
            <div>
                <button className="btn btn-primary mt-2" onClick={handleCreateTeam}>Создать команду</button>
            </div>
        </div>
    );
};

export default NoTeamPage;