import React, { useState, useEffect } from 'react';
import { FaPen, FaTimes } from 'react-icons/fa';
import './style/Account.css'; // Файл со стилями

function Account({ isAuthenticated }) {
    const [userData, setUserData] = useState(null);
    const [refreshRequired, setRefreshRequired] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editedFirstName, setEditedFirstName] = useState('');
    const [editedLastName, setEditedLastName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            if (isAuthenticated) {
                try {
                    const response = await fetch(
                      '/api/user/',
                      {
                      headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                      },
                    }
                  );
                    if (response.ok) {
                        console.log('OK')
                        const userDataFromApi = await response.json();
                        console.log(userDataFromApi)
                        setUserData(userDataFromApi);
                    } else if (response.status === 401) {
                      setRefreshRequired(true);
                    } else {
                        console.error('Failed to fetch user data');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, [isAuthenticated, refreshRequired]);

    useEffect(() => {
      if (refreshRequired) {
          fetch('/api/token/refresh', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json;charset=utf-8',
              },
              body: JSON.stringify({ refresh: localStorage.getItem('refreshToken') }),
          })
          .then(response => {
              if (response.ok) {
                  return response.json();
              } else {
                  throw new Error(`Something went wrong: code ${response.status}`);
              }
          })
          .then(({ access, refresh}) => {
              localStorage.setItem('accessToken', access);
              localStorage.setItem('refreshToken', refresh);
              
              setRefreshRequired(false);
          })
          .catch(error => {
              console.error(error);
              // Обработка ошибки обновления токена
          });
      }
  }, [refreshRequired]);

  const handleEdit = () => {
    console.log('EditStarted')
    setEditMode(true);
    setEditedFirstName(userData.data.first_name);
    setEditedLastName(userData.data.last_name);
    setEditedEmail(userData.data.email);

};

const handleSave = async () => {
    try {
        const response = await fetch('/api/user/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
                first_name: editedFirstName,
                last_name: editedLastName,
                email: editedEmail,
            }),
        });

        if (response.ok) {
            console.log('EditFinishingStarted')

            const updatedUserData = await response.json();
            const modifiedResponse = { data: updatedUserData };
            console.log('GotResponse')

            setUserData(modifiedResponse);
            console.log(modifiedResponse)
            console.log('StateUpdated')

            setEditMode(false);
            console.log('EditFinished')

        } else {
            console.error('Failed to update user data');
        }
    } catch (error) {
        console.error('Error updating user data:', error);
    }
};



return (
    <div className="text-center">
        {isAuthenticated && userData ? (
            <div className="text-center">
                <h3 className="mb-2">Привет, {userData.data.first_name} {userData.data.last_name}</h3>
                <div className="card mx-auto mt-4" style={{ maxWidth: '400px' }}>
                    <div className="card-body">
                        <div>
                            {editMode ? (
                                <>
                                    <div className="container">
                                        <h4 className="card-subtitle mb-3 text-muted">Отредактируй свой профиль</h4>
                                        <div className="row justify-content-center">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="firstName"
                                                        placeholder="Имя"
                                                        value={editedFirstName}
                                                        onChange={(e) => setEditedFirstName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="lastName"
                                                        placeholder="Фамилия"
                                                        value={editedLastName}
                                                        onChange={(e) => setEditedLastName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        id="email"
                                                        placeholder="Email"
                                                        value={editedEmail}
                                                        onChange={(e) => setEditedEmail(e.target.value)}
                                                    />
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <button onClick={handleSave} className="btn btn-secondary" style={{ marginRight: '10px' }}>Сохранить</button>
                                                    <button onClick={() => setEditMode(false)} className="btn btn-secondary">Отмена <FaTimes /></button>
                                                </div>                                         
                                            </div>
                                        </div>
                                    </div>

                                </>
                            ) : (
                                <>
                                    <div className="card-container">
                                        <h4 className="card-subtitle mb-4 text-muted">Ваш профиль</h4>
                                        <p className="card-text ">Имя пользователя: {userData.data.username}</p>
                                        <p className="card-text ">Email: {userData.data.email}</p>
                                        <p className="card-text">Вы зарегистрировались {new Date(userData.data.date_joined).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>                                        
                                        <button onClick={handleEdit} className="edit-button">
                                            <FaPen className="edit-icon" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <p>Пожалуйста, войдите для доступа к аккаунту</p>
        )}
    </div>
);

};

export default Account;