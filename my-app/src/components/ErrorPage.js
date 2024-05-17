import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const ErrorPage = ({ errorCode, errorMessage }) => {
    const goToHomePage = () => {
        window.location.href = '/';
    };

    return (
        <Container className="text-center">
            <Row className="justify-content-center mt-5">
                <Col md={6}>
                    <h1 className="text-danger">Ошибка {errorCode}</h1>
                    <p>{errorMessage}</p>
                    <Button variant="primary" onClick={goToHomePage} style={{ color: 'white', backgroundColor: '#32CD32', border: '1px solid #32CD32'  }} className="ml-2">На главную</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default ErrorPage;
