import React, { useState, useEffect } from 'react';
import Logo from '../assets/Logo.png';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoIosLogOut } from "react-icons/io";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import Footer from './Footer';
import { API_URL } from '../api';
import { FaHome } from "react-icons/fa";

const Header = ({ name, handleLogout, phanquyen }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [data, setData] = useState([]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const navigate = useNavigate();

    const navigateToAccount = () => {
        navigate("/auth/dashboard/account");
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/content/all`);
                setData(response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const filteredData = data.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
        <div className='scroll-full'>
            <header className='Header'>
                {name && (
                    <span className='flex-header'>
                        <span className='flex-menu'>
                            <IoMdMenu size={25} className='iconmenu' onClick={toggleMenu} />
                            <div className={`Menu ${isMenuOpen ? 'MenuOpen' : ''}`}>
                                <span className='flex-report-niso-menu'>
                                    <IoMdClose size={25} className='iconmenu' onClick={closeMenu} />
                                    <input
                                        type='text'
                                        className='input1'
                                        placeholder='Tìm kiếm nhanh...'
                                        style={{ marginTop: '20px', marginBottom: '20px' }}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <NavLink activeclassname="active" to="/auth/dashboard/home" className='link-data'>
                                        <FaHome size={16} />
                                        Home
                                    </NavLink>
                                    {filteredData.length > 0 ? (
                                        filteredData.slice().reverse().map((item) => (
                                            <NavLink activeclassname="active" key={item.title} to={`/auth/dashboard/views/${item.keys}`} className='link-data'>
                                                {item.title}
                                            </NavLink>
                                        ))
                                    ) : (
                                        <p style={{ fontSize: '13px' }}>Không tìm thấy kết quả tìm kiếm !</p>
                                    )}
                                    {phanquyen === true && (
                                        <button onClick={navigateToAccount}>Quản lý tài khoản</button>
                                    )}
                                    <button onClick={handleLogout}>Đăng xuất</button>
                                </span>
                            </div>
                            <Link to="/auth/dashboard/home" className='LOGO'>
                                <img src={Logo} alt='Logo' />
                                <span className='name-logo-niso-mobile'>REPORT NISO</span>
                            </Link>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', marginRight: '15px' }}>
                                Xin chào, <span style={{color: '#ae8f3d'}}>{name}</span>
                            </span>
                            <IoIosLogOut onClick={handleLogout} className='iconmenu' size={25} />
                        </span>
                    </span>
                )}
            </header>
            <Outlet />
        </div>
        <Footer />
        </>
    );
};

export default Header;
