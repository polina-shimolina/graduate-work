import React, { useState } from 'react';

const Photos = () => {
  const [selectedFile, setSelectedFile] = useState();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  }

  return (
    <div className="container">
      <h1>Загрузка файла</h1>

      <form>
        <div className="form-group">
          <label htmlFor="fileInput">Выберите файл:</label>
          <input 
            type="file"
            onChange={handleFileSelect} 
            id="fileInput"
          />
        </div>

        {selectedFile && (
          <div>
            <img src={URL.createObjectURL(selectedFile)} alt="Preview" /> 
          </div>
        )}

        <button type="submit">Запустить волшебство</button>
      </form>
    </div>
  );
};

export default Photos;