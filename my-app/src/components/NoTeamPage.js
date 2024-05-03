import React, { useState } from 'react';

const NoTeamPage = () => {
    const [teamName, setTeamName] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleCreateTeam = () => {
        setShowModal(true);
    };

    const handleCreateTeamSubmit = () => {
        // Здесь можно добавить логику для создания команды
        console.log('Создание команды:', teamName);
        setShowModal(false);
    };

    const handleCloseModal = (e) => {
        if (e.target === e.currentTarget) {
            setShowModal(false);
        }
    };

    return (
        <div className="container text-center mt-4">
            <h2>Вы не состоите в команде</h2>
            <p>Создайте новую команду или дождитесь приглашения</p>
            <button className="btn btn-primary" onClick={handleCreateTeam}>Создать команду</button>

            {showModal && (
                <div className="modal" onClick={handleCloseModal}>
                    <div className="modal-content">
                        <h3>Введите название команды</h3>
                        <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
                        <button onClick={handleCreateTeamSubmit}>Создать</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoTeamPage;
