import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';

import image1 from '../assets/happy1.jpg'; 
import image2 from '../assets/happy2.jpg';
import image3 from '../assets/happy3.jpg';

const Main = () => {

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
        
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
  );
}

export default Main;