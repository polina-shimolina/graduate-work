import React, { useState } from 'react';

const Photos = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [contrast, setContrast] = useState(100);
  const [sharpness, setSharpness] = useState(0);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  }

  const handleContrastChange = (event) => {
    setContrast(event.target.value);
  }

  const handleSharpnessChange = (event) => {
    setSharpness(event.target.value);
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
            <img 
              src={URL.createObjectURL(selectedFile)} 
              alt="Preview" 
              style={{
                filter: `contrast(${contrast}%) brightness(100%) saturate(100%) blur(${sharpness}px)`
              }}
            />
            <div>
              <label htmlFor="contrastRange">Контрастность:</label>
              <input 
                type="range" 
                min="0" 
                max="200" 
                value={contrast} 
                onChange={handleContrastChange} 
                id="contrastRange"
              />
            </div>
            <div>
              <label htmlFor="sharpnessRange">Резкость:</label>
              <input 
                type="range" 
                min="-10" 
                max="10" 
                value={sharpness} 
                onChange={handleSharpnessChange} 
                id="sharpnessRange"
              />
            </div>
            <button type="submit">Запустить волшебство</button>
          </div>
        )}
        

        <button type="submit">Запустить волшебство</button>
      </form>
    </div>
  );
};

export default Photos;
