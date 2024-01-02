import React from "react";
import { Link } from "react-router-dom";
import UserHeader from "./UserHeader";
import logo from "../assets/flash.ico";

const UserLayout = ({ children }) => {

  return (
    <div className="user-layout">
      <UserHeader />
      <div className="user-content">
        <Link style={{ height: 'fit-content', width: 'fit-content', paddingLeft: '3px'}} to="/home">
          <img style={{ height: 'fit-content', width: '100px' }} src={logo} alt="Helpy logo" />
        </Link>
        <div className="user-content-main">
          {children}
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
