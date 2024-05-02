import React from 'react';

const Account = ({ firstName, lastName, username, email, dateJoined }) => {
    return (
        <div className="Account">
            <h1>{firstName} {lastName}</h1>
            <h2>{username}</h2>
            <p>Email: {email}</p>
            <p>Профиль создан: {dateJoined}</p>
        </div>
    );
};

export default Account;