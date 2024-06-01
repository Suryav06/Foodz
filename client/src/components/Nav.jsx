import React, { useState, useEffect } from 'react';
import img from "../assets/logo.png";
import { useNavigate } from 'react-router-dom';
import { Menu, MenuHandler, MenuList, MenuItem, IconButton } from "@material-tailwind/react";

function Nav() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const userLoggedIn = window.sessionStorage.getItem('isLoggedIn') === 'true';
    const storedUsername = window.sessionStorage.getItem('username');
    setIsLoggedIn(userLoggedIn);
    setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    setUsername('');
    navigate('/');
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };
  
  const handleSavedRedirect = () => {
    navigate('/saved');
  };

  return (
    <div className='bg-green-900 pb-9'>
      <header>
        <nav className="flex items-center pt-5 px-4 mx-auto max-w-screen-xl sm:px-8 justify-between">
          <div>
            <img
              src={img}
              width={110}
              height={50}
              className='rounded-3xl'
              alt="Logo"
            />
          </div>
          <div>
            <ul className="flex space-x-3 sm:space-x-6">
              <li>
                {isLoggedIn ? (
                  <Menu>
                    <MenuHandler>
                      <IconButton variant="text">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                          <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                        </svg>
                      </IconButton>
                    </MenuHandler>
                    <MenuList>
                      <MenuItem className='text-lime-600'>{username}</MenuItem>
                      <MenuItem onClick={handleSavedRedirect}>Saved</MenuItem> 
                      <MenuItem onClick={handleLogout} className='text-red-600'>Logout</MenuItem>
                    </MenuList>
                  </Menu>
                ) : (
                  <a href="javascript:void(0)" className="flex items-center text-gray-200" onClick={handleLoginRedirect}>
                    Log In
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                )}
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Nav;
