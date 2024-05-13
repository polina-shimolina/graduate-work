import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';

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
            {photoData && (
                
                <Row style={{ marginLeft: '300px', marginRight: '300px'  }}>
                    <h3>Изображения</h3>
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
                </Row>
            )}
        </div>
    );
};

export default PhotoDetail;
