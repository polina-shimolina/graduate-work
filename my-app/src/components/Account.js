import React, { useState, useEffect } from 'react';
import { FaPen } from 'react-icons/fa';
import './style/Account.css'; // Файл со стилями

function Account({ isAuthenticated }) {
    const [userData, setUserData] = useState(null);
    const [refreshRequired, setRefreshRequired] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editedFirstName, setEditedFirstName] = useState('');
    const [editedLastName, setEditedLastName] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            if (isAuthenticated) {
                try {
                    const response = await fetch(
                      '/api/user',
                      {
                      headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                      },
                    }
                  );
                    if (response.ok) {
                        const userDataFromApi = await response.json();
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
    setEditMode(true);
    setEditedFirstName(userData.data.first_name);
    setEditedLastName(userData.data.last_name);
};

const handleSave = async () => {
    try {
        const response = await fetch('/api/user/update/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
                first_name: editedFirstName,
                last_name: editedLastName,
            }),
        });
        if (response.ok) {
            const updatedUserData = await response.json();
            setUserData(updatedUserData);
            setEditMode(false);
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
                                    <h4 className="card-subtitle mb-3 text-muted">Отредактируй свой профиль</h4>
                                    <div className="mb-3 text-center">
                                        <input
                                            type="text"
                                            placeholder="Имя"
                                            value={editedFirstName}
                                            onChange={(e) => setEditedFirstName(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3 text-center">
                                        <input
                                            type="text"
                                            placeholder="Фамилия"
                                            value={editedLastName}
                                            onChange={(e) => setEditedLastName(e.target.value)}
                                        />
                                    </div>
                                    <button onClick={handleSave}>Сохранить</button>
                                </>
                            ) : (
                                <>
                                    <div className="card-container">
                                    <h4 className="card-subtitle mb-3 text-muted">Твой профиль</h4>
                                    <p className="card-text text-center">Имя пользователя: {userData.data.username}</p>
                                    <p className="card-text text-center">Email: {userData.data.email}</p>
                                    <p className="card-text text-center">Дата регистрации: {new Date(userData.data.date_joined).toLocaleDateString()}</p>
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
