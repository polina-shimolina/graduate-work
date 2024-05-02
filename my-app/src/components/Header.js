import React, { useState, useEffect } from 'react';import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header_Authorised from './Header_Authorised';
import Header_UnAuthorised from './Header_UnAuthorised';

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('accessToken') ? true : false);
    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(localStorage.getItem('accessToken') ? true : false);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return isAuthenticated ? <Header_Authorised /> : <Header_UnAuthorised />;
};

export default Header;