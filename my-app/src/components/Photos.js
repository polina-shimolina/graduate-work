import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './style/Photos.css'

const Photos = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const userId = localStorage.getItem('id')
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [isCheckedArray, setIsCheckedArray] = useState([]);
  const getTeamId = async (userId) => {
    try {
        const response = await fetch(`/api/user/${userId}/team/`);
        if (!response.ok) {
            throw new Error('Failed to fetch team data');
        }
        const data = await response.json();
        return data.team_id;
    } catch (error) {
        console.error('Error fetching teamId:', error);
        return null;
    }
  };

  const handleCheckboxChange = async (photo, index) => {
    try {
        const teamId = await getTeamId(userId); // Получаем teamId асинхронно
        if (!teamId) {
            console.error('Team ID not found');
            return;
        }
        console.log(selectedPhotos)
        let isChecked = photo.is_visible_to_team
        console.log(isChecked)
        const updatedIsCheckedArray = [...isCheckedArray];
        updatedIsCheckedArray[index] = !updatedIsCheckedArray[index];
        setIsCheckedArray(updatedIsCheckedArray);
        if (isChecked) {
            // Убираем фото из выбранных
            setSelectedPhotos(selectedPhotos.filter(item => item !== photo));
            console.log(selectedPhotos)
            // Вызываем функцию updateTeamPhoto с передачей photo.id, teamId и false для снятия галочки
            await updateTeamPhoto(photo.id, teamId, false, userId);
            //fetchUserPhotos(); // Обновляем фотографии пользователя
        } else {
            // Добавляем фото в выбранные
            setSelectedPhotos([...selectedPhotos, photo]);
            console.log(selectedPhotos)
            // Вызываем функцию updateTeamPhoto с передачей photo.id, teamId и true для постановки галочки
            await updateTeamPhoto(photo.id, teamId, true, userId);
            //fetchUserPhotos(); // Обновляем фотографии пользователя
        }
    } catch (error) {
        console.error('Error handling checkbox change:', error);
    }
};

  const updateTeamPhoto = (photoId, teamId, checked) => {
      fetch(`/api/photo/${photoId}/${teamId}/${checked}/`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
      })
      .then(response => {
      console.log("=============")
      console.log(response)
      console.log("=============")
       
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          console.log(data);
      })
      .catch(error => {
          console.error('Error:', error);
      });
  };

  const handleUploadFile = async () => {
    if (!selectedFile) {
      console.error('Файл не был выбран');
      alert('Выберите файл перед отправкой.');
      return;
    }
    const formData = new FormData();
    formData.append('photo', selectedFile);

    try {
      const response = await fetch('/api/photo/upload/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Файл успешно отправлен на сервер', result);
        document.getElementById('fileInput').value = '';
        setSelectedFile(null);
        fetchUserPhotos();
        
        /*alert('Файл успешно загружен.');*/
      } else {
        console.error('Произошла ошибка при отправке файла на сервер:', response.status);
        /*alert('Ошибка при отправке файла.');*/
      }
    } catch (error) {
      console.error('Произошла ошибка при выполнении запроса', error);
      alert('Ошибка сети или сервера.');
    }
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  }
  const fetchUserPhotos = async () => {
    try {
        const response = await fetch(`/api/photo/user/${userId}`);
        if (response.ok) {
            console.log("Фотографии пользователя получены");
            const data = await response.json();
            const segmentedPhotos = data.map((item, index) => {
              return {
                  id: item.id, 
                  segmented_photo: item.segmented_photo,
                  uploaded_photo: item.uploaded_photo,
                  is_visible_to_team: item.is_visible_to_team

              };
          }); // Получаем массив сегментированных фотографий
            setUploadedPhotos(segmentedPhotos);
            setIsCheckedArray(segmentedPhotos.map(photo => photo.is_visible_to_team));
            console.log(segmentedPhotos.length);
            console.log(segmentedPhotos);
        } else {
            console.error('Ошибка при получении фотографий пользователя');
        }
    } catch (error) {
        console.error('Произошла ошибка при загрузке фотографий', error);
    }
};
  useEffect(() => {
    const fetchData = async () => {
      await fetchUserPhotos();
  };

  fetchData();
}, []);

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center' }}>
        Загрузка файла
        <span className="question-mark" 
                            title="На этой странице ты можешь сегментировать свое фото. Нажми на кнопку ''Choose file'' и выбери фото, затем нажми ''Open'' и ''Отправить на сервер''. В результате твое фото окажется в галерее, вместе с ранее обработанными фото."
                            >?
                            </span>
      </h1>

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
                  <Link to={`/photos/${photo.id}`}>
                    <Card className="card" style={{ width: '18rem' }}>
                      <Card.Img variant="top" src={photo.segmented_photo} style={{ width: '100%', height: '200px', objectFit: 'cover' }}/>
                      <Card.Body>
                        <Form.Check
                          type="checkbox"
                          checked={isCheckedArray[index]}
                          onChange={() => handleCheckboxChange(photo, index)}
                          label="Добавить на страницу команды"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Card.Body>
                    </Card>
                  </Link>
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
