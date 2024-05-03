import React, { useState } from 'react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (response.ok) {
            // Сохраняем полученный токен в localStorage
            localStorage.setItem('token', data.token);
            // Перенаправляем пользователя на защищенную страницу
            window.location.href = '/';
        } else {
            console.error(data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="container mt-4 text-center">
    <div className="row">
        <div className="col-sm-6 mx-auto">
            <input type="text" className="form-control mb-3" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
    </div>
    <div className="row">
        <div className="col-sm-6 mx-auto">
            <input type="password" className="form-control mb-3" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
    </div>
    <div className="row">
        <div className="col-sm-6 mx-auto">
            <input type="email" className="form-control mb-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
    </div>
    <div className="row">
        <div className="col mx-auto">
            <button type="submit" className="btn btn-primary">Зарегистрироваться</button>
        </div>
    </div>
    <div className="row mt-3">
        <div className="col mx-auto">
            <a href="/login" className="text-decoration-underline">Уже есть аккаунт? Войти</a>
        </div>
    </div>
</form>

    );
};

export default Register;
