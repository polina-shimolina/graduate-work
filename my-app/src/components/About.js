import React from 'react';
import { Link } from "react-router-dom";

const About = () => {
    const token = localStorage.getItem('accessToken');
    return (
        <div>
            <div>
                <h1>О сервисе</h1>
                <div>
                    <p>Сервис "Сегментатор объектов" предназначен для автоматической сегментации объектов на изображениях с использованием машинного обучения.</p>
                    <p>Этот инновационный инструмент поможет вам выделить объекты на фотографиях и улучшить процесс анализа изображений.</p>
                    <p>Присоединяйтесь к нам и узнайте больше о возможностях нашего сервиса!</p>
                </div>
                {token ? (
                    <Link to="/photos">Испытать сервис</Link>
                ) : (
                    <Link to="/login">Испытать сервис</Link>
                )}            
                </div>

        </div>
    );
};

export default About;
