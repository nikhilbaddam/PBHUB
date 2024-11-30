import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Icons for hamburger menu
import { StoreContext } from '../context/StoreContext';
import image from '../assets/images-2.png'
const Navbar = () => {
    const navigate = useNavigate();
    const { token, setToken, user} = useContext(StoreContext);
    const [showMenu, setShowMenu] = useState(false); // Menu visibility state
    

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate('/login');
    };


    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    return (
        <div className='bg-gray-800 text-white px-8 md:px-16 py-4 shadow-md'>
            <div className='flex items-center justify-between'>
                <div className='flex flex-row items-center justify-between ' >
                <h1 className='text-2xl font-semibold cursor-pointer'>PGHUB</h1>
                <img src={image} alt="" className='w-12 ml-2 rounded-full decoration-white' />
                </div>

                {/* Desktop Navigation */}
                <ul className='hidden md:flex items-center gap-8 font-medium'>
                    <NavLink to='/' className={({ isActive }) => isActive ? ' underline underline-offset-4 text-primary font-bold' : 'hover:text-primary transition-colors duration-200'}>
                        <li>HOME</li>
                    </NavLink>
                    <NavLink to='/addguests' className={({ isActive }) => isActive ? ' underline underline-offset-4 text-primary font-bold' : 'hover:text-primary transition-colors duration-200'}>
                        <li>ADDGUEST</li>
                    </NavLink>
                    <NavLink to='/guestslist' className={({ isActive }) => isActive ? ' underline underline-offset-4 text-primary font-bold' : 'hover:text-primary transition-colors duration-200'}>
                        <li>GUESTSLIST</li>
                    </NavLink>
                    {user?.role === 'admin' && (
                        <>
                            <NavLink to='/admin' className={({ isActive }) => isActive ? ' underline underline-offset-4 text-primary font-bold' : 'hover:text-primary transition-colors duration-200'}>
                                <li>ADMIN</li>
                            </NavLink>
                            <NavLink to='/worker' className={({ isActive }) => isActive ? ' underline underline-offset-4 text-primary font-bold' : 'hover:text-primary transition-colors duration-200'}>
                                <li>WORKER</li>
                            </NavLink>
                        </>
                    )}
                </ul>

                {/* Profile/Login & Logout Buttons */}
                <div className='hidden md:flex items-center gap-4'>
                    {token ? (
                        <div className='flex items-center gap-4'>
                            <p className='cursor-pointer hover:underline'>{user?.name} ({user?.role})</p>
                            <button 
                                onClick={handleLogout} 
                                className='bg-primary text-white px-6 py-2 rounded-full font-light hover:bg-primary-dark transition-colors duration-200'>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => navigate('/login')} 
                            className='bg-primary text-white px-6 py-2 rounded-full font-light hover:bg-primary-dark transition-colors duration-200'>
                            Login
                        </button>
                    )}
                </div>

                {/* Hamburger Menu Icon for Mobile */}
                <div className='md:hidden flex items-center'>
                    <button onClick={toggleMenu} className='text-2xl ' aria-label="Toggle navigation menu">
                        {showMenu ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {showMenu && (
                <div className='  md:hidden bg-gray-800 mt-4 p-4 rounded-lg shadow-lg'>
                    <ul className='  flex flex-col items-start gap-4 font-medium'>
                        <NavLink to='/' onClick={toggleMenu} className='hover:text-primary transition-colors duration-200'>
                            <li>HOME</li>
                        </NavLink>
                        <NavLink to='/addguests' onClick={toggleMenu} className='hover:text-primary transition-colors duration-200'>
                            <li>AddGuest</li>
                        </NavLink>
                        <NavLink to='/guestslist' onClick={toggleMenu} className='hover:text-primary transition-colors duration-200'>
                            <li>GUESTSLIST</li>
                        </NavLink>
                        {user?.role === 'admin' && (
                            <>
                                <NavLink to='/admin' onClick={toggleMenu} className='hover:text-primary transition-colors duration-200'>
                                    <li>ADMIN</li>
                                </NavLink>
                                <NavLink to='/worker' onClick={toggleMenu} className='hover:text-primary transition-colors duration-200'>
                                    <li>WORKER</li>
                                </NavLink>
                            </>
                        )}
                    </ul>
                    <div className='mt-4'>
                        {token ? (
                            <button 
                                onClick={() => { handleLogout(); toggleMenu(); }} 
                                className='bg-primary text-white px-6 py-2 rounded-full font-light hover:bg-primary-dark transition-colors duration-200 w-full'>
                                Logout
                            </button>
                        ) : (
                            <button 
                                onClick={() => { navigate('/login'); toggleMenu(); }} 
                                className='bg-primary text-white px-6 py-2 rounded-full font-light hover:bg-primary-dark transition-colors duration-200 w-full'>
                                Login
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
