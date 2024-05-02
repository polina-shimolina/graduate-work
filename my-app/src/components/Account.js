import React, { useState, useEffect } from 'react';

function Account({ isAuthenticated }) {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
      if (isAuthenticated) {
        const firstName = localStorage.getItem('firstName');
        const lastName = localStorage.getItem('lastName');
        const username = localStorage.getItem('username');
        const email = localStorage.getItem('email');
        const dateJoined = localStorage.getItem('dateJoined');
  
        setUserData({ firstName, lastName, username, email, dateJoined });
      }
    }, [isAuthenticated]);
    return (
        <div>
          {isAuthenticated && userData? (
            <div>
              <h2>Привет, {userData.firstName} {userData.lastName}</h2>
              <p>Имя пользователя: {userData.username}</p>
              <p>Email: {userData.email}</p>
              <p>Дата регистрации: {userData.dateJoined}</p>
              {/* Другие компоненты и данные аккаунта */}
            </div>
          ) : (
            <p>Пожалуйста, войдите для доступа к аккаунту</p>
          )}
        </div>
    );
};

export default Account;
