import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Photos = () => {
  const [selectedFile, setSelectedFile] = useState();

  const handleUploadFile = async () => {
    if (!selectedFile) {
      console.error('Файл не был выбран');
      return;
    }
    const formData = new FormData();
    formData.append('photo', selectedFile);

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

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center' }}>Загрузка файла</h1>

      <form onSubmit={(e) => e.preventDefault()} style={{ textAlign: 'center' }}>
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
    </div>
  );
};

export default Photos;
