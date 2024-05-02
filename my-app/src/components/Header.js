import React, { useState } from 'react';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import my_logo from "../assets/new_map_logo.png";
import Header_Authorised from './Header_Authorised';
import Header_UnAuthorised from './Header_UnAuthorised';

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));

    return(
        <div>
            {isAuthenticated ? (
                <Header_Authorised />
            ) : (
                <Header_UnAuthorised />
            )}
        </div>
    );
};

export default Header;
