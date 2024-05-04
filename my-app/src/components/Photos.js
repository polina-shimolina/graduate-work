import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Photos = () => {
  const [selectedFile, setSelectedFile] = useState();

  const handleUploadFile = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    try {
      const response = await fetch('/api/upload/', {
        method: 'POST',
        body: formData
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Ответ от сервера:', data);
        //alert('Файл успешно загружен на сервер!');
      } else {
        throw new Error('Ошибка при загрузке файла');
      }
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
      //alert('Произошла ошибка при загрузке файла.');
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
