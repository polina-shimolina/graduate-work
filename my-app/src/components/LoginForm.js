import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



function Login({ onLogin }) {
  const [access, setAccess] = useState()
  const [refresh, setRefresh] = useState(localStorage.getItem('refreshToken'))
  const [refreshRequired, setRefreshRequired] = useState(false)
  const [loading, setLoading] = useState()
  const [formUsername, setFormUsername] = useState()
  const [formPassword, setFormPassword] = useState()
  const [userId, setUserId] = useState('')
  // eslint-disable-next-line
  const [firstName, setFirstName] = useState('');
  // eslint-disable-next-line
  const [lastName, setLastName] = useState('');
  // eslint-disable-next-line
  const [username, setUsername] = useState('');
  // eslint-disable-next-line
  const [email, setEmail] = useState('');
  // eslint-disable-next-line
  const [dateJoined, setDateJoined] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    if (refreshRequired) {
    fetch(
        '/api/token/refresh',
        {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ refresh })
      }
    )
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw Error(`Something went wrong: code ${response.status}`)
        }
      })
      .then(({access, refresh}) => {
        localStorage.setItem('accessToken', access)
        setAccess(access)
        localStorage.setItem('refreshToken', refresh)
        setRefresh(refresh)
        setError(null)
        
      })
      .catch(error => {
        console.log(error)
        setError('Ошибка, подробности в консоли')
      })
    }
  }, [refreshRequired])


  
  const submitHandler = e => {
    e.preventDefault();
    setLoading(true);
    fetch(
      '/api/token/obtain',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          username: formUsername,
          password: formPassword,
        })
      }
    )
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw Error(`Something went wrong: code ${response.status}`)
        }
      })
      .then(({access, refresh}) => {
        localStorage.setItem('accessToken', access)
        console.log(access)
        setAccess(access)
        localStorage.setItem('refreshToken', refresh)
        setRefresh(refresh)
        setError(null)


        fetch('/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Bearer ${access}`,
          },
      })
      .then(response => {
          if (response.ok) {
              return response.json();
          } else {
              throw new Error(`Something went wrong: code ${response.status}`);
          }
      })
      .then(data => {
          console.log(data.data.id);
          setUserId(data.data.id);
          localStorage.setItem('id', data.data.id)
          localStorage.setItem('firstName', data.data.first_name)
          localStorage.setItem('lastName', data.data.last_name)
          localStorage.setItem('username', data.data.username)

      })
      .catch(error => {
          console.log(error);
          setError('Ошибка при получении id');
      });

        onLogin()
        
        navigate('/')
           })
           .catch(error => {
             console.log(error)
             setError('Ошибка, подробности в консоли')
           })
      .finally(setLoading(false))
    }
    
    

  return (
    <div className="App">
      {error? <p>{error}</p> : null}
      {!access?
      loading? "Загрузка..." :
      <form className="container mt-4 text-center" onSubmit={submitHandler}>
          <h2>Вход</h2>
          <div className="row">
        <div className="col-sm-6 mx-auto">
          <input className="form-control mb-3" type="text" name="username" value={formUsername} onChange={e => setFormUsername(e.target.value)} placeholder="Username"/>
          </div>
        </div>
        <div className="row">
        <div className="col-sm-6 mx-auto">
          <input className="form-control mb-3" type="password" name="password" value={formPassword} onChange={e => setFormPassword(e.target.value)} placeholder="Password"/>
          </div>
        </div>
        <div className="row">
        <div className="col mx-auto">
          <button className="btn btn-primary" type="submit">Войти</button>
        </div>
        </div>
        <div className="row mt-3">
        <div className="col mx-auto">
            <a href="/register" className="text-decoration-underline">Еще нет аккаунта? Зарегистрируйтесь</a>
        </div>
    </div>
      </form>
      :
      !error?
        null
        :
        null
      }
    </div>
  );
}

export default Login;