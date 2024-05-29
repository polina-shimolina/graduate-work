import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/a.css'

function Register({ onRegister }) {
  const [loading, setLoading] = useState(false);
  const [formUsername, setFormUsername] = useState('');
  const [formFirstname, setFormFirstname] = useState('');
  const [formLastname, setFormLastname] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formEmail, setFormEmail] = useState('');
  // eslint-disable-next-line
  const [error, setError] = useState('');
  const navigate = useNavigate();
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch('/api/user/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
        username: formUsername,
        password: formPassword,
        first_name: formFirstname,
        last_name: formLastname,
        email: formEmail
      }),
    })
      .then((response) => {
        if (response.status === 201) {
            // Пользователь успешно зарегистрирован
            // Выполните необходимые действия, например, перенаправление на страницу входа
          } else if (response.status === 409) {
            // Логин занят
            throw Error('Что-то пошло не так. Возможно такое имя пользователя уже занято.');
          } else {
            // Обработка других ошибок
            throw Error('Произошла ошибка при регистрации. Пожалуйста, попробуйте еще раз.');
          }
      })
      .then(() => {
        onRegister();
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
        window.alert('Что-то пошло не так. Возможно такое имя пользователя уже занято.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="App">
  
      {localStorage.getItem('accessToken') ? (
          <p>Вы уже вошли в систему.</p>
        ) : (
          <form className="container mt-4 text-center" onSubmit={submitHandler}>
            <h2>Регистрация</h2>
            <div className="row">
              <div className="col-sm-6 mx-auto">
                <input
                  className="form-control mb-3"
                  type="text"
                  name="username"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  placeholder="Username"
                  required
                />
              </div>
            </div>
            <div className="row">
          <div className="col-sm-6 mx-auto">
            <input
              className="form-control mb-3"
              type="email"
              name="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
        </div>
            <div className="row">
              <div className="col-sm-6 mx-auto">
                <input
                  className="form-control mb-3"
                  type="password"
                  name="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            <div className="row">
          <div className="col-sm-6 mx-auto">
            <input
              className="form-control mb-3"
              type="text"
              name="firstname"
              value={formFirstname}
              onChange={(e) => setFormFirstname(e.target.value)}
              placeholder="First Name (optional)"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6 mx-auto">
            <input
              className="form-control mb-3"
              type="text"
              name="lastname"
              value={formLastname}
              onChange={(e) => setFormLastname(e.target.value)}
              placeholder="Last Name (optional)"
            />
          </div>
        </div>

            <div className="row">
              <div className="col mx-auto">
                <button className="btn btn-primary" style={{ color: 'white', backgroundColor: '#32CD32', border: '1px solid #32CD32'  }} type="submit">Зарегистрироваться</button>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col mx-auto">
                <a href="/login" className="text-decoration-underline">Уже есть аккаунт? Войдите</a>
              </div>
            </div>
          </form>
        )}
    </div>
  );
}

export default Register;
