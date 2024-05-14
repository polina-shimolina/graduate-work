import 'bootstrap/dist/css/bootstrap.min.css';
import Header_Authorised from './Header_Authorised';
import Header_UnAuthorised from './Header_UnAuthorised';
import { AuthContext } from './AuthContext';
import React, { useContext } from 'react';
const Header = ({logged}) => {

    return logged ? <Header_Authorised /> : <Header_UnAuthorised />;
};

export default Header;