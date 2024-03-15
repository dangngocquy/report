import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from './axios';
import Login from './component/Login';
import { API_URL } from './api';
import Header from './component/Header';
import Body from './component/Body';
import AddAccount from './component/AddAccount';
import NotFound from './component/NotFound'
import './App.css';
import ViewDetail from './component/ViewDetail';

const ProtectedRoute = ({ element, isLoggedIn, redirectTo }) => {
  return isLoggedIn ? element : <Navigate to={redirectTo} />;
};

const App = () => {

  const storedUsername = localStorage.getItem('username');
  const storedName = localStorage.getItem('name');
  const storedid = localStorage.getItem('keys');
  const [username, setUsername] = useState(storedUsername || '');
  const [phanquyen, setPhanquyen] = useState(() => {
    return localStorage.getItem('phanquyen') === 'true';
  });
  const [password, setPassword] = useState('');
  const [name, setName] = useState(storedName || '');
  const [keys, setID] = useState(storedid || '');
  const [isLoggedIn, setLoggedIn] = useState(!!storedUsername);
  const [error, setError] = React.useState('');

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('username', username);
      localStorage.setItem('name', name);
      localStorage.setItem('keys', keys);
      localStorage.setItem('phanquyen', phanquyen);
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('name');
      localStorage.removeItem('keys');
      localStorage.removeItem('bophan');
      localStorage.removeItem('phanquyen');
    }
  }, [isLoggedIn, username, name, keys, phanquyen]);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu !");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      const user = response.data;
      setName(user.name);
      setID(user.keys);
      setPhanquyen(user.phanquyen);
      setLoggedIn(true);
      setError('');
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        setUsername('');
        setPassword('');
        setError("Tên đăng nhập hoặc mật khẩu không chính xác !");
      } else {
        setError("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau !");
      }
    }
  };

  const handleLogout = () => {
    setUsername('');
    setPassword('');
    setPhanquyen('');
    setName('');
    setID('');
    setLoggedIn(false);
    window.location.href = '/';
  };

  useEffect(() => {
    localStorage.setItem('phanquyen', phanquyen);
  }, [phanquyen]);
  return (
    <Router className='font-serif'>
      <Routes>
        <Route path='/' element={isLoggedIn ? (<Navigate to='/auth/dashboard/home' />) : (
          <Login
            setUsername={setUsername}
            setPassword={setPassword}
            handleLogin={handleLogin}
            username={username}
            password={password}
            setError={setError}
            phanquyen={phanquyen}
            error={error} />
        )
        }
        />
        <Route
          path='/'
          element={
            <Header
              name={name}
              handleLogout={handleLogout}
              phanquyen={phanquyen}
            />
          }
        >
          <Route path='/auth/dashboard/home' element={<ProtectedRoute
            element={<Body phanquyen={phanquyen} name={name} />}
            isLoggedIn={isLoggedIn}
            redirectTo='/'
          />} />

          <Route path='/auth/dashboard/views/:keys' element={<ProtectedRoute
            element={<ViewDetail phanquyen={phanquyen} />}
            isLoggedIn={isLoggedIn}
            redirectTo='/'
          />} />

          {phanquyen === true && (
            <Route path='/auth/dashboard/account' element={<ProtectedRoute
              element={<AddAccount />}
              isLoggedIn={isLoggedIn}
              redirectTo='/'
            />} />
          )}
          <Route path='*' element={<ProtectedRoute
            element={<NotFound />}
            isLoggedIn={isLoggedIn}
            redirectTo='/'
          />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
