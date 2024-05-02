import React from 'react';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import my_logo from "../assets/new_map_logo.png";

const Header_Authorised = () => {
    return(
        <div>
            <header
                className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
                <a href="/" className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                    <img src={my_logo} alt='' height='50'/>
                    <h1 style={{fontSize: '20px', margin: '15px'}}>ShapeExtract</h1>
                </a>
                <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                    <li><Link to="/" className="nav-link px-2 link-dark">Главная</Link></li>
                    <li><Link to="/photos" className="nav-link px-2 link-dark">Попробовать</Link></li>
                    <li><Link to="/about" className="nav-link px-2 link-dark">О сервисе</Link></li>
                    <li><Link to="/account" className="nav-link px-2 link-dark">Личный кабинет</Link></li>
                    <li><Link to="/logout" className="nav-link px-2 link-dark">Выйти</Link></li>
                </ul>
                
            </header>
            
        </div>
    );
};

export default Header_Authorised;