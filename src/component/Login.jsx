import React, { useState, useEffect } from 'react';
import Background from '../assets/background.png';
import { BiShow, BiHide } from "react-icons/bi";

const Login = ({ setUsername, setPassword, handleLogin, username, password, phanquyen, error }) => {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [rememberPassword, setRememberPassword] = useState(false);

    useEffect(() => {
        const storedUsername = localStorage.getItem('rememberedUsername');
        const storedPassword = localStorage.getItem('rememberedPassword');
    
        if (rememberPassword && storedUsername && storedPassword) {
            setUsername(storedUsername);
            setPassword(storedPassword);
        }
    }, [rememberPassword, setUsername, setPassword]);

    const handleCheckboxChange = () => {
        setRememberPassword(!rememberPassword);
    };

    const handleFormSubmit = (e) => {
        if (rememberPassword) {
            localStorage.setItem('rememberedUsername', username);
            localStorage.setItem('rememberedPassword', password);
        } else {
            localStorage.removeItem('rememberedUsername');
            localStorage.removeItem('rememberedPassword');
        }
        handleLogin(e);
    };

    return (
        <div className='center-report-login-niso'>
            <div className='containers'>
                <title>Đăng nhập - REPORT NISO</title>
                <div className='margin'>
                    <form onSubmit={(e) => handleFormSubmit(e)} className='box-sign-in'>
                        <h1 className='color-text'>SIGN IN <p className='color-text'>REPORT NISO</p></h1>
                        <input
                            type="text"
                            placeholder="Email or username"
                            value={username}
                            onChange={(e) => {setUsername(e.target.value); }}
                            name='username'
                            autoComplete="on"
                            className='input1'
                        />
                        <div className='input'>
                            <input
                                type={showOldPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => {setPassword(e.target.value); }}
                                name='password'
                                autoComplete="on"
                            />
                            <div onClick={() => setShowOldPassword(!showOldPassword)}>
                                {showOldPassword ? <BiHide size={26} className='icon'/> : <BiShow size={26} className='icon'/>}
                            </div>
                        </div>
                        <span className='Niso-checkbox'>
                            <input
                                type='checkbox'
                                checked={rememberPassword}
                                onChange={handleCheckboxChange}
                            />
                            <p>Remember password</p>
                        </span>
                        <button type="submit">Sign in</button>
                        <span style={{ textAlign: 'left', fontSize: '9pt', color: 'rgba(255, 96, 98, 1)', position: 'absolute', bottom: '-25px' }} className='n-pc'>{error}</span>
                        <span style={{ textAlign: 'left', fontSize: '9pt', color: 'rgba(255, 96, 98, 1)' }} className='n-mb'>{error}</span>
                    </form>
                    <img src={Background} alt="Ảnh bìa" className='background' />
                </div>
            </div>
        </div>
    );
};

export default Login;
