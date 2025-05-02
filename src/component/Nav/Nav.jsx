import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../../provider/Authprovider';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
    const navigate = useNavigate();
    const { user, logout, userInfo, setUserInfo } = useContext(AuthContext);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (user?.id) {
                try {
                    const res = await fetch(`http://localhost:3000/user/${user.id}`, {
                        credentials: 'include'
                    });
                    const data = await res.json();
                    setUserInfo(data);
                } catch (err) {
                    console.error('Failed to load user info:', err);
                }
            }
        };

        fetchUserInfo();
    }, [user]);

    const handleLogout = async () => {
        await logout();
        window.location.href = "/";
    };

    const handleNotificationClick = () => {
        navigate('/notification');
    };

    const loggedInLinks = (
        <>
            <li>
                <button
                    onClick={() => {
                        if (userInfo?.role) {
                            navigate(`/${userInfo.role}profile`);
                        }
                    }}
                    className="btn btn-ghost"
                >
                    Profile
                </button>
            </li>

            {/* Show notification button for investors and entrepreneurs */}
            {(userInfo?.role === 'investor' || userInfo?.role === 'entrepreneur') && (
                <li>
                    <button
                        onClick={handleNotificationClick}
                        className="btn btn-ghost"
                    >
                        Notifications
                    </button>
                </li>



            )}

            <li>
                <NavLink to="/wallet" className="btn btn-ghost">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Wallet
                    </div>
                </NavLink>
            </li>

            <li><button onClick={handleLogout} className="btn btn-ghost">Logout</button></li>
        </>
    );

    const loggedOutLinks = (
        <>
            <li><NavLink to="/login">Login</NavLink></li>
            <li><NavLink to="/register">Register</NavLink></li>
        </>
    );

    const t = user ? loggedInLinks : loggedOutLinks;

    return (
        <div>
            <div className="navbar bg-base-100">
                <div className="navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            {t}
                        </ul>
                    </div>
                    <Link className="mb-2 text-3xl text-green-500 normal-case btn btn-ghost" to='/'>CwFund</Link>
                </div>
                <div className="hidden navbar-center lg:flex">
                    <ul className="px-1 menu menu-horizontal">
                        {t}
                    </ul>
                </div>
                <div className="navbar-end">
                    {userInfo ? <span className="text-sm text-gray-600">Hi, {userInfo.role}</span> : null}
                    {/* Notification Button at top right */}
                    {/* {(userInfo?.role === 'investor' || userInfo?.role === 'entrepreneur') && (
                        <button
                            onClick={handleNotificationClick}
                            className="ml-4 btn btn-ghost"
                        >
                            Notifications
                        </button>
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default Nav;
