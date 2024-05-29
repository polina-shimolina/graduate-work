import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Row, Col, Button } from 'react-bootstrap';
import './style/card-wrapper.css'


const COLOR_MAPPING = {
    '(226, 169, 41)': 'Вода',
    '(132, 41, 246)': 'Земля',
    '(110, 193, 228)': 'Дорога',
    '(60, 16, 152)': 'Здание',
    '(254, 221, 58)': 'Растение'
};

const Legend = () => {
    return (
        <Card className="mx-2 my-2">
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


    const handleSaveImage = async (imageUrl) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
    
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: 'segmented_image.jpg',
                types: [
                    {
                        description: 'JPEG файл',
                        accept: {
                            'image/jpeg': ['.jpg'],
                        },
                    },
                ],
            });
    
            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();
    
        } catch (error) {
            console.error('Error saving image:', error);
        }
    };
    

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
                <Row className="card-wrapper" style={{ marginLeft: '100px', marginRight: '100px', display: 'flex' }}>
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
                            <Card.Img variant="top" src={photoData.uploaded_photo.photo} className="img-fluid" style={{ height: '400px', objectFit: 'cover' }} />
                            <Card.Body>
                                <Card.Title>Загруженное фото</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="mx-2 my-2">
                            <Card.Img variant="top" src={photoData.segmented_photo.photo} className="img-fluid" style={{ height: '400px', objectFit: 'cover' }} />
                            <Card.Body>
                                <Card.Title>Сегментированное фото</Card.Title>
                                <Button variant="success" onClick={() => handleSaveImage(photoData.segmented_photo.photo)}>Сохранить изображение</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={2}>
                        <Card className="legend-card mx-2 my-2" style={{ height: '50%' }}>
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
                    </Col>
                </Row>
            )}
        </div>
    );
    
};

export default PhotoDetail;
