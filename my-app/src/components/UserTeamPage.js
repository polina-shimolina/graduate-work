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

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-danger">Выйти из команды</button>
            </div>
            <h2>{team.name}</h2>
            <p>Автор: {team.author}</p>
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
