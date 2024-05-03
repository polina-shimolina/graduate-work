import React, { useState, useEffect } from 'react';

function Account({ isAuthenticated }) {
    const [userData, setUserData] = useState(null);
    const [refreshRequired, setRefreshRequired] = useState(false);

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
  return (
    <div className="text-center">
        
            {isAuthenticated && userData ? (
                  <div className="text-center">

              <h3 className="mb-2">Привет, {userData.data.first_name} {userData.data.last_name}</h3>
              <div className="card mx-auto mt-4" style={{ maxWidth: '400px' }}>
                  <div className="card-body">
                <div>
                    <h4 className="card-subtitle mb-3 text-muted">Твой профиль</h4>
                    <p className="card-text">Имя пользователя: {userData.data.username}</p>
                    <p className="card-text">Email: {userData.data.email}</p>
                    <p className="card-text">Дата регистрации: {userData.data.date_joined}</p>
                    {/* Другие компоненты и данные аккаунта */}
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
