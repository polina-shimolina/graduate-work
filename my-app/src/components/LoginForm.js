import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



function Login({ onLogin }) {
  const [access, setAccess] = useState(localStorage.getItem('accessToken'))
  const [refresh, setRefresh] = useState(localStorage.getItem('refreshToken'))
  const [refreshRequired, setRefreshRequired] = useState(false)
  const [loading, setLoading] = useState()
  const [formUsername, setFormUsername] = useState()
  const [formPassword, setFormPassword] = useState()
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [dateJoined, setDateJoined] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    if (access) {
      fetch(
          '/api/user',
          {
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Bearer ${access}`,
          },
        }
      )
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          if (response.status === 401) {
            throw Error('refresh')
          }
          throw Error(`Something went wrong: code ${response.status}`);
        }
      })
      .then(({ data }) => {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setUsername(data.username);
        setEmail(data.email);
        setDateJoined(data.date_joined);
        setError(null)
      })
      .catch(error => {
        if (error.message === 'refresh') {
          setRefreshRequired(true)
        } else {
          console.log(error)
          setError('Ошибка, подробности в консоли')
        }
      })
    } 
  }, [access])



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
        setAccess(access)
        localStorage.setItem('refreshToken', refresh)
        setRefresh(refresh)
        setError(null)
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        localStorage.setItem('dateJoined', dateJoined);
        console.log(firstName);
        console.log(email);

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