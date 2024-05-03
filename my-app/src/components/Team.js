import UserTeamPage from './UserTeamPage'
import NoTeamPage from './NoTeamPage';

const Team = ({ hasTeam }) => {
    return (
        <div className="container mt-4">
            {hasTeam ? <UserTeamPage /> : <NoTeamPage />}
        </div>
    );
};

export default Team;
