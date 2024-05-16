import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from "react-router-dom";

import image1 from '../assets/image1.jpg'; 
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';

const Main = () => {
  const token = localStorage.getItem('accessToken');
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '1000px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h1>О сервисе</h1>
        </div>
        <div>
            <p>Сервис предназначен для автоматической сегментации объектов на изображениях с использованием машинного обучения.</p>
            <p>Этот инновационный инструмент поможет вам выделить объекты на фотографиях и улучшить процесс анализа изображений.</p>
            <p>В основе технологии лежит архитектура U-Net. Архитектура сети представляет собой полносвязную свёрточную сеть, модифицированную так, чтобы она могла работать с меньшим количеством примеров (обучающих образов) и делала более точную сегментацию.</p>
            <p>Присоединяйтесь к нам и узнайте больше о возможностях нашего сервиса!</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px'}}>
            {token ? (
                    <Link to="/photos">Испытать сервис</Link>
                ) : (
                    <Link to="/login">Испытать сервис</Link>
                )}
                </div>
        </div>
    
    <div style={{ display: 'flex', justifyContent: 'center', maxWidth: '1000px', width: '100%' , margin: 'auto' }}>
    <Carousel style={{ width: 700 }}>
      <Carousel.Item>
        <img 
          className="d-block w-100"
          src={image1}
          alt="Happy person 1" 
        />
      </Carousel.Item>  

      <Carousel.Item>
        <img
          className="d-block w-100"
          src={image2}
          alt="Happy person 2"
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src={image3}
          alt="Happy person 3" 
        />
      </Carousel.Item>
    </Carousel>
    </div>
    </div>
    </div>
  );
}

export default Main;