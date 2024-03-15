import React, { useEffect, useCallback, useState } from 'react';
import axios from '../axios';
import { API_URL } from '../api';
import Modal from './Modal';
import { CiSearch } from "react-icons/ci";

const AddAccount = () => {
    const {
        openModal,
        closeModal,
        showModal,
    } = Modal();

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        phanquyen: false,
    });

    const [admins, setAdmins] = useState([]);
    const [selectedAdminId, setSelectedAdminId] = useState(null);
    const [formStatus, setFormStatus] = useState('add');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isVisible, setIsVisible] = useState(true);
    const [initialFormData, setInitialFormData] = useState({
        name: '',
        username: '',
        password: '',
        phanquyen: '',
    });

    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    const fetchAdmins = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/users/all`);
            const { docs } = response.data;
            setAdmins(docs);
        } catch (error) {
            console.error('Error fetching admins:', error);
        }
    }, [setAdmins]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/users/all`);
                const { docs } = response.data;
                setUsers(docs);
                fetchAdmins();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [setUsers, fetchAdmins]);

    const handleAdminSelection = (adminId) => {
        setSelectedAdminId(adminId);
        fetchAdminDetails(adminId);
    };

    const fetchAdminDetails = async (adminId) => {
        try {
            const response = await axios.get(`${API_URL}/users/get/${adminId}`);
            const adminData = response.data;
            setFormData({
                name: adminData.name,
                phanquyen: adminData.phanquyen,
                username: adminData.username,
                password: adminData.password,
            });
            setInitialFormData({
                name: adminData.name,
                phanquyen: adminData.phanquyen,
                username: adminData.username,
                password: adminData.password,
            });
            setFormStatus('edit');
        } catch (error) {
            console.error('Error fetching admin details:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, checked } = e.target;
        const inputValue = e.target.type === 'checkbox' ? checked : e.target.value;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: inputValue }));
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const reversedData = filteredUsers.slice().reverse();
    const currentUsers = reversedData.slice(indexOfFirstItem, indexOfLastItem);

    const handleAddAdmin = async () => {
        if (!formData.name || !formData.username || !formData.password) {
            setErrorMessage("Bạn chưa nhập đầy đủ thông tin !");
            return;
        }

        const existingAdmin = admins.find(admin => admin.username === formData.username);
        if (existingAdmin) {
            setErrorMessage("Tên người dùng hoặc tài khoản đã tồn tại trên hệ thống !");
            return;
        }

        try {
            const requestData = {
                name: formData.name,
                username: formData.username,
                password: formData.password,
                phanquyen: formData.phanquyen ? 1 : 0,
            };

            await axios.post(`${API_URL}/users/add`, requestData);
            setFormData({ name: '', phanquyen: '', username: '', password: '' });
            setErrorMessage('');
            setSuccessMessage("Thêm tài khoản thành công, làm mới trang để xem thay đổi! !");
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
            fetchAdmins();
        } catch (error) {
            console.error('Error adding admin:', error);
        }
    };

    const handleUpdateAdmin = async () => {
        if (
            formData.name === initialFormData.name &&
            formData.username === initialFormData.username &&
            formData.phanquyen === initialFormData.phanquyen &&
            formData.password === initialFormData.password
        ) {
            setErrorMessage("Thông tin tài khoản không thay đổi, không thể cập nhật !");
            return;
        }

        if (!formData.name || !formData.username || !formData.password) {
            setErrorMessage("Bạn chưa nhập đầy đủ thông tin !");
            return;
        }

        const existingAdmin = admins.find(
            (admin) => admin.username === formData.username && admin.keys !== selectedAdminId
        );
        if (existingAdmin) {
            setErrorMessage(
                "Tên người dùng hoặc tài khoản đã tồn tại trên hệ thống !"
            );
            return;
        }

        try {
            await axios.put(`${API_URL}/users/update/${selectedAdminId}`, {
                ...formData,
                phanquyen: formData.phanquyen ? 1 : 0,
            });

            setSelectedAdminId(null);
            setFormData({ name: '', phanquyen: false, username: '', password: '' });
            setFormStatus('add');
            setErrorMessage('');
            setSuccessMessage("Cập nhật user thành công, làm mới trang để xem thay đổi! !");
            fetchAdmins();
        } catch (error) {
            console.error('Error updating admin:', error);
        }
    };

    const handleDeleteAdmin = async () => {
        try {
            await axios.delete(`${API_URL}/users/delete/${selectedAdminId}`);
            setSelectedAdminId(null);
            setFormData({ name: '', phanquyen: '', username: '', password: '' });
            setFormStatus('add');
            setErrorMessage('');
            setSuccessMessage("Xóa tài khoản User thành công, làm mới trang để xem thay đổi!");
            closeModal();
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
            fetchAdmins();
        } catch (error) {
            console.error('Error deleting admin:', error);
        }
    };

    const handleCancel = () => {
        setFormData({ name: '', phanquyen: '', username: '', password: '' });
        setSelectedAdminId(null);
        setFormStatus('add');
        setErrorMessage('');
        setSuccessMessage('');
    };

    const generateRandomPassword = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%zxcvbnmasdfghjklqwertyuiop';
        let newPassword = '';
        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            newPassword += characters.charAt(randomIndex);
        }
        setFormData({ ...formData, password: newPassword });
    };

    return (
        <div className='body-report-main'>
            <title>Niso - Quản lý tài khoản nội bộ</title>
            <h3 style={{ marginBottom: '15px' }}>Quản lý tài khoản nội bộ</h3>

            <div className='account-nisso-report'>
                <div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CiSearch className='iconmenu' size={32} onClick={toggleVisibility} />
                        {isVisible ? null :
                            <input
                                type='search'
                                placeholder='Nhập tên tài khoản để tìm kiếm'
                                className='input1'
                                value={searchQuery}
                                onChange={handleSearch}
                            />}
                    </span>
                    {filteredUsers.length === 0 ? (
                        <table id="customers" style={{ marginTop: '20px' }}>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Họ tên</th>
                                    <th>Loại tài khoản</th>
                                    <th>Tài khoản</th>
                                    <th>Mật khẩu</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center' }}>
                                        Không tìm thấy tài khoản nào phù hợp!
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    ) : (
                        <table id="customers" style={{ marginTop: '20px' }}>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Họ tên</th>
                                    <th>Loại tài khoản</th>
                                    <th>Tài khoản</th>
                                    <th>Mật khẩu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((admin, index) => (
                                    <tr key={admin.keys} onClick={() => handleAdminSelection(admin.keys)}>
                                        <td>{index + 1}</td>
                                        <td>{admin.name}</td>
                                        <td>
                                            {admin.phanquyen ? (
                                                <p className="center-box-account" style={{ color: '#d9534f', border: '1px solid #d9534f', padding: '5px' }}>Admin</p>
                                            ) : (
                                                <p className="center-box-account" style={{ color: '#32a846', border: '1px solid #32a846', padding: '5px' }}>User</p>
                                            )}
                                        </td>
                                        <td>{admin.username}</td>
                                        <td>{admin.password}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', alignItems: 'center' }}>
                        <button type="button" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                            Previous
                        </button>
                        <span style={{ fontSize: '11pt' }}>Trang {currentPage}</span>
                        <button type="button" onClick={() => setCurrentPage(currentPage + 1)} disabled={indexOfLastItem >= users.length}>
                            Next
                        </button>
                    </div>
                </div>
                <div style={{ marginTop: '15px' }}>
                    <form>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ fontWeight: 'bold' }}>Họ tên:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className='input1' placeholder='Nhập họ tên' />
                        </span>

                        <span style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                            <label style={{ fontWeight: 'bold' }}>Tài khoản:</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className='input1'
                                placeholder='Nhập tài khoản'
                            />
                        </span>

                        <span style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                            <label style={{ fontWeight: 'bold' }}>Mật khẩu:</label>
                            <span className='grid-create'>
                                <input
                                    type="text"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className='input1'
                                    placeholder='Nhập mật khẩu'
                                />
                                <button type="button" onClick={generateRandomPassword}>
                                    Tạo mật khẩu ngẫu nhiên
                                </button>
                            </span>
                            <span>
                            </span>
                        </span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                            <label style={{ fontWeight: 'bold' }}>Phân quyền <i style={{ fontSize: '8pt' }}>(on = Admin, off = User)</i></label>
                            <label className="switch-niso">
                                <input
                                    type="checkbox"
                                    className='niso-input'
                                    name="phanquyen"
                                    checked={formData.phanquyen}
                                    onChange={handleInputChange}
                                />

                                <span className="slider-niso round-niso"></span>
                            </label>
                        </span>
                    </form>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <span className='flex-btn'>
                            {formStatus === 'add' ? (
                                <button type="button" onClick={handleAddAdmin}>
                                    Thêm
                                </button>
                            ) : (
                                <>
                                    <button type="button" onClick={handleUpdateAdmin}>
                                        Cập nhật
                                    </button>
                                    <button type="button" onClick={openModal}>
                                        Xóa
                                    </button>
                                </>
                            )}

                            {formStatus === 'edit' && (
                                <button type="button" onClick={handleCancel}>
                                    Hủy
                                </button>
                            )}
                        </span>
                    </div>
                    <div style={{ textAlign: 'left', fontSize: '9pt', color: 'rgba(255, 96, 98, 1)', marginTop: '15px' }}>{errorMessage}</div>
                    <div style={{ textAlign: 'left', fontSize: '9pt', color: 'rgba(255, 96, 98, 1)', marginTop: '15px' }}>{successMessage}</div>
                </div>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content modal-content-mobile" style={{ maxWidth: '400px', margin: '15% auto' }}>
                        <h1 style={{ color: 'red', textAlign: 'center' }} className='font-black text-2xl'>Warning !</h1>
                        <h3 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }} className='text-sm'>Bạn chắc chắn muốn xóa tài khoản này?</h3>
                        <span className='button-box-modal' style={{ float: 'right' }}>
                            <button onClick={handleDeleteAdmin}>Xóa</button>
                            <button onClick={closeModal}>Hủy</button>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddAccount;