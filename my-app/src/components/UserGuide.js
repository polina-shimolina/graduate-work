import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

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
                    <h2>Как начать</h2>
                    <p>Для начала использования приложения зарегистрируйся или войди в свой аккаунт.</p>
                    <p>Для этого нажми на кнопку <a href='\login'>Войти</a> на навигационной панели. Затем введи логин и пароль и нажми кнопку "Войти".</p>
                    <p>Если у тебя нет аккаунта, то ты можешь зарегистрироваться, нажав на кнопку <a href='\register'>Зарегистрироваться</a> на навигационной панели. Введи логин, почту и пароль, а также имя и фамилию по желанию, и нажми "Зарегистрироваться"</p>
                    <h2>Основные функции</h2>
                    <ul>
                        <li>Фотографии: Нажми на раздел <a href='\photos'>Попробовать</a> в меню чтобы посмотреть свою галерею или добавить туда новое фото.</li>
                        <li>Команда: Перейди на страницу <a href='\team'>Команда</a>, чтобы ознакомиться со списокм участников и увидеть фотографии, добавленные в общий доступ.</li>
                        <li>Личный кабинет: Нажми на <a href='\profile'>свой логин</a> в правой верхней части экрана, чтобы увидеть свою личную информацию и отредактировать ее.</li>
                    </ul>
                    <h2>Помощь и поддержка</h2>
                    <p>На каждой странице есть маленькие знаки вопроса, при наведении на который своего курсора, ты можешь получить подсказку.</p>
                    <p>Если возникли вопросы или проблемы, обращайся в <a href={`mailto:${supportEmail}`} onClick={handleContactSupport} style={{ color: 'blue', cursor: 'pointer' }}>службу поддержки</a>.</p>
                </Col>
            </Row>
        </Container>
    );
}

export default UserGuide;
