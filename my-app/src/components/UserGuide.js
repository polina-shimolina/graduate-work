import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './style/a.css'
const UserGuide = () => {
    const supportEmail = 'support@example.com';
    const handleContactSupport = () => {
        window.location.href = `mailto:${supportEmail}`;
    }

    return (
        <Container>
            <Row>
                <Col>
                    <h1>Руководство пользователя</h1>
                    <p>Добро пожаловать в наше приложение! Ниже приведены основные шаги для использования приложения:</p>
                    <h3>Как начать</h3>
                    <p>Для начала использования приложения зарегистрируйся или войди в свой аккаунт.</p>
                    <p>Для этого нажми на кнопку <a href='\login'>Войти</a> на навигационной панели. Затем введи логин и пароль и нажми кнопку "Войти".</p>
                    <p>Если у тебя нет аккаунта, то ты можешь зарегистрироваться, нажав на кнопку <a href='\register'>Зарегистрироваться</a> на навигационной панели. Введи логин, почту и пароль, а также имя и фамилию по желанию, и нажми "Зарегистрироваться"</p>
                    <h3>Основные функции</h3>
                    <ul>
                        <li>Фотографии: Нажми на раздел <a href='\photos'>Попробовать</a> в меню чтобы посмотреть свою галерею или добавить туда новое фото.</li>
                        <li>Команда: Перейди на страницу <a href='\team'>Моя команда</a>, чтобы ознакомиться со списокм участников и увидеть фотографии, добавленные в общий доступ.</li>
                        <li>Личный кабинет: Нажми на <a href='\profile'>свой юзернейм</a> в правой верхней части экрана, чтобы увидеть свою личную информацию и отредактировать ее.</li>
                        <li>Также можешь посмотреть код сервиса по сссылке <a href='https://github.com/polina-shimolina/graduate-work'>GitHub Репозиторий</a> проекта внизу страницы.</li>
                    </ul>
                    <h3>Помощь и поддержка</h3>
                    <p>На каждой странице есть маленькие знаки вопроса, при наведении своего курсора на который ты можешь получить подсказку.</p>
                    <p>Если возникли вопросы или проблемы, обращайся в <a href={`mailto:${supportEmail}`} onClick={handleContactSupport} style={{ cursor: 'pointer' }}>службу поддержки</a>.</p>
                </Col>
            </Row>
        </Container>
    );
}

export default UserGuide;
