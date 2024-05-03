import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style/UserTeamPage.css'; // Импорт стилей для карточки

const UserTeamPage = () => {
    const team = {
        name: 'Название команды',
        author: 'Автор команды',
        createdAt: '01.03.2024', // дата создания команды
    };

    const navigate = useNavigate();

    const handleCardClick = () => {
        // Добавьте здесь логику для перехода на другую страницу при клике на карточку
        console.log('Переход на другую страницу');
        // Пример перехода на страницу фотографий
        navigate('/photos');
    };

    const handleInviteClick = () => {
        // Логика для обработки нажатия на кнопку "Пригласить в команду"
        console.log('Пригласить в команду');
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h2>{team.name}</h2>
                    <p>Автор: {team.author}</p>
                </div>
                <div>
                    <button className="btn btn-primary mr-2" onClick={handleInviteClick}>Пригласить в команду</button>
                    <button className="btn btn-danger ml-2">Выйти из команды</button>
                </div>
            </div>
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
