import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Row, Col, Button } from 'react-bootstrap';

const COLOR_MAPPING = {
    '(226, 169, 41)': 'Вода',
    '(132, 41, 246)': 'Земля',
    '(110, 193, 228)': 'Дорога',
    '(60, 16, 152)': 'Здание',
    '(254, 221, 58)': 'Растение'
};

const Legend = () => {
    return (
        <Card className="mx-1 my-2">
            <Card.Body>
                <Card.Title>Легенда</Card.Title>
                {Object.entries(COLOR_MAPPING).map(([color, label]) => (
                    <div key={color} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: `rgb${color}`, marginRight: '10px' }}></div>
                        <span>{label}</span>
                    </div>
                ))}
            </Card.Body>
        </Card>
    );
};

const PhotoDetail = () => {
    const { id } = useParams();
    const [photoData, setPhotoData] = useState(null);

    useEffect(() => {
        const fetchPhotoData = async () => {
            try {
                const response = await fetch(`/api/userphoto/${id}/`);
                const data = await response.json();
                setPhotoData(data);
            } catch (error) {
                console.error('Error fetching photo data:', error);
            }
        };

        fetchPhotoData();
    }, [id]);

    return (
        <div>
            <Link to="/photos" style={{ position: 'absolute', top: '100px', left: '10px', zIndex: 1000 }}>
                <Button variant="primary">&#8592; Назад к фотографиям</Button>
            </Link>
            {photoData && (
                <Row style={{ marginLeft: '300px', marginRight: '300px' }}>
                    <h1 style={{ textAlign: 'center' }}>
                        Изображения
                        <span className="question-mark" 
                            title="На этой странице можешь посмотреть на фото, которое ты загрузил, и получил в результате сегментации.
                            При нажатии на кнопку &quot;Назад к фотографиям&quot; ты вернешься на страницу с галереей."
                            >?
                            </span>
                    </h1>
                    <Col>
                        <Card className="mx-2 my-2">
                            <Card.Img variant="top" src={photoData.uploaded_photo.photo} />
                            <Card.Body>
                                <Card.Title>Загруженное фото</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="mx-2 my-2">
                            <Card.Img variant="top" src={photoData.segmented_photo.photo} />
                            <Card.Body>
                                <Card.Title>Сегментированное фото</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={2}>
                        <Legend />
                    </Col>
                </Row>
            )}
        </div>
    );
    
};

export default PhotoDetail;
