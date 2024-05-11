import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Form } from 'react-bootstrap';

const Photos = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const userId = localStorage.getItem('id')
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const handleCheckboxChange = (photo) => {
    if (selectedPhotos.includes(photo)) {
        setSelectedPhotos(selectedPhotos.filter(item => item !== photo));
    } else {
        setSelectedPhotos([...selectedPhotos, photo]);
    }
};

  const handleUploadFile = async () => {
    if (!selectedFile) {
      console.error('Файл не был выбран');
      return;
    }
    const formData = new FormData();
    formData.append('photo', selectedFile);
    if (formData.has('photo')) {
      console.log('В объекте formData есть данные по ключу "photo"');
    } else {
      console.log('В объекте formData нет данных по ключу "photo"');
    }
    try {
      const response = await fetch('/api/photo/upload/', {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary= ${formData.boundary}`,
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
        body: formData,
      });

      if (response.ok) {
        console.log('Файл успешно отправлен на сервер');
      } else {
        console.error('Произошла ошибка при отправке файла на сервер');
      }
    } catch (error) {
      console.error('Произошла ошибка при выполнении запроса', error);
    }
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  }

  useEffect(() => {
    const fetchUserPhotos = async () => {
        try {
            const response = await fetch(`/api/photo/user/${userId}`);
            if (response.ok) {
                console.log("Фотографии пользователя получены");
                const data = await response.json();
                const segmentedPhotos = data.map(item => item.segmented_photo); // Получаем массив сегментированных фотографий
                setUploadedPhotos(segmentedPhotos);
                console.log(segmentedPhotos.length);
                console.log(segmentedPhotos);
            } else {
                console.error('Ошибка при получении фотографий пользователя');
            }
        } catch (error) {
            console.error('Произошла ошибка при загрузке фотографий', error);
        }
    };

    fetchUserPhotos();
}, [userId]);

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center' }}>Загрузка файла</h1>

      <form onSubmit={(e) => e.preventDefault()} style={{ textAlign: 'center', marginBottom: '50px' }}>
        <div className="form-group">
          <label htmlFor="fileInput" className="form-label">Выберите файл:</label>
          <input 
            type="file"
            onChange={handleFileSelect} 
            id="fileInput"
            className="form-control"
            style={{ width: '200px', margin: '0 auto' }}
          />
        </div>

        {selectedFile && (
          <div style={{ margin: '20px auto', textAlign: 'center' }}>
            <img 
              src={URL.createObjectURL(selectedFile)} 
              alt="Preview" 
              style={{ marginBottom: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
            />
            <button className="btn btn-secondary" onClick={handleUploadFile}>Отправить файл на сервер</button>
          </div>
        )}
      </form>
      <div>
      <h1 style={{ textAlign: 'center' }}>Моя галерея</h1>

      {uploadedPhotos && uploadedPhotos.length > 0 ? (
          <div>
            <div className="row">
              {uploadedPhotos.map((photo, index) => (
                <div key={index} className="col-md-4 mb-3">
                  <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={photo} style={{ width: '100%', height: '200px', objectFit: 'cover' }}/>
                            <Card.Body>
                                <Form.Check
                                    type="checkbox"
                                    checked={selectedPhotos.includes(photo)}
                                    onChange={() => handleCheckboxChange(photo)}
                                    label="Добавить на страницу команды"
                                />
                            </Card.Body>
                        </Card>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p style={{ textAlign: 'center' }}>Вы пока не добавили ни одного изображения, поэтому в вашей галерее пусто(( Загрузите свое первое изображение.</p>
        )}
      </div>
    </div>
  );
};

export default Photos;
