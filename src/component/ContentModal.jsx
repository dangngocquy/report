import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { API_URL } from '../api';
import { Link } from 'react-router-dom';
import Modal from './Modal';

function ContentModal({ closeModalid, key_link, name, id_keys, phanquyenmodal }) {
    const [editedLink, setEditedLink] = useState(key_link);
    const [editedTitle, setEditedTitle] = useState(name);
    const [iframeLink, setIframeLink] = useState(key_link);
    const [isEditing, setIsEditing] = useState(false);
    const {
        openModal,
        closeModal,
        showModal,
    } = Modal();

    useEffect(() => {
        setIframeLink(editedLink);
    }, [editedLink]);

    const handleEdit = async () => {
        try {
            setIsEditing(true);

            if (editedTitle === name && editedLink === key_link) {
                alert('Không có thay đổi để lưu.');
                return;
            }

            const exists = await checkExistence(editedTitle, editedLink);
            if (exists) {
                alert('Tên hoặc liên kết đã tồn tại.');
                return;
            }

            const response = await axios.put(`${API_URL}/content/update/${id_keys}`, {
                link: editedLink,
                title: editedTitle
            });

            console.log(response.data);
            alert('Sửa thành công, vui lòng làm mới trang !');
            closeModalid();
        } catch (error) {
            console.error('Error editing content:', error);
        } finally {
            setIsEditing(false);
        }
    };


    const handleCopy = (content) => {
        const el = document.createElement('textarea');
        el.value = content;
        document.body.appendChild(el);
        const range = document.createRange();
        range.selectNode(el);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        document.body.removeChild(el);
        alert('Sao chép thành công!');
    };

    const checkExistence = async (newTitle, newLink) => {
        try {
            const response = await axios.get(`${API_URL}/content/all`, {
                params: {
                    title: newTitle,
                    link: newLink,
                }
            });
            return response.data.exists;
        } catch (error) {
            console.error('Error checking existence:', error);
            return false;
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${API_URL}/content/delete/${id_keys}`);
            console.log(response.data);
            closeModalid();
            alert('Xóa thành công !')
        } catch (error) {
            console.error('Error deleting content:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="flex-niso-report-iframe">
                    <span style={{ marginRight: '2rem' }}>
                        {phanquyenmodal === true && (<h2>Embed code</h2>)}
                        {phanquyenmodal === false && (<h2>Thông tin REPORT BI</h2>)}
                        <label style={{ display: "flex", gap: '10px', flexDirection: 'column', marginTop: '20px' }}>
                            {phanquyenmodal === true && (<b>Nhập tiêu đề BI</b>)}
                            {phanquyenmodal === false && (<b>Tên REPORT</b>)}
                            {phanquyenmodal === true && (
                                <input
                                    type="text"
                                    placeholder="Nhập tiêu đề BI"
                                    className="input1"
                                    id="titleInput"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                />
                            )}
                            {phanquyenmodal === false && (
                                <input
                                    type="text"
                                    placeholder="Nhập tiêu đề BI"
                                    className="input1"
                                    id="titleInput"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    disabled
                                />
                            )}
                        </label>
                        <label style={{ display: "flex", gap: '10px', flexDirection: 'column', marginTop: '20px' }}>
                            {phanquyenmodal === true && (<b>Nhập liên kết</b>)}
                            {phanquyenmodal === false && (<b>Liên kết</b>)}
                            <div className='coppy'>
                                {phanquyenmodal === true && (
                                    <input
                                        type="text"
                                        placeholder="Nhập liên kết BI"
                                        className='input1'
                                        value={editedLink}
                                        onChange={(e) => setEditedLink(e.target.value)}
                                    />
                                )}
                                {phanquyenmodal === false && (
                                    <input
                                        type="text"
                                        placeholder="Nhập liên kết BI"
                                        className='input1'
                                        value={editedLink}
                                        onChange={(e) => setEditedLink(e.target.value)}
                                        disabled
                                    />
                                )}
                                <button onClick={() => handleCopy(editedLink)}>Sao chép</button>
                            </div>
                        </label>
                        <label style={{ display: "flex", gap: '10px', flexDirection: 'column', marginTop: '20px' }}>
                            <b>Sao chép iframe</b>
                            <div className='coppy'>
                                <input
                                    type="text"
                                    placeholder="Nhập liên kết BI"
                                    className='input1'
                                    value={`<iframe src=${iframeLink} title${name} width="300px" height="300px" className='view_iframe' ></iframe>`}
                                    disabled
                                />
                                <button onClick={() => handleCopy(`<iframe src=${iframeLink} title=${name} width="300px" height="300px" className='view_iframe' ></iframe>`)}>Sao chép</button>
                            </div>
                        </label>
                        <span className='button-box-modal' style={{marginTop: '20px'}}>
                            <Link to={`/auth/dashboard/views/${id_keys}`} target='_blank'><button>Xem trang chính</button></Link>
                            {phanquyenmodal === true && (
                                <>
                                    <button onClick={handleEdit} disabled={isEditing}>
                                        Sửa
                                    </button>
                                    <button onClick={openModal} disabled={isEditing}>
                                        Xóa
                                    </button>
                                    {showModal && (
                                        <div className="modal">
                                            <div className="modal-content modal-content-mobile" style={{ maxWidth: '400px', margin: '15% auto' }}>
                                                <h1 style={{ color: 'red', textAlign: 'center' }} className='font-black text-2xl'>Warning !</h1>
                                                <h3 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }} className='text-sm'>Bạn có chắc chắn muốn xóa báo cáo này?</h3>
                                                <span className='button-box-modal' style={{ float: 'right' }}>
                                                    <button onClick={handleDelete}>Xóa</button>
                                                    <button onClick={closeModal}>Hủy</button>
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                            <button onClick={closeModalid} className='text-sm btn-close' disabled={isEditing}>
                                Close
                            </button>
                        </span>
                        {/* {phanquyenmodal === false &&
                            <span className='note'>
                                <span onClick={() => setShowNotes(!showNotes)}>
                                    <b style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: '#ae8f3d' }}><CiCirclePlus size={25} />Gửi yêu cầu (Nếu có)</b>
                                </span>
                                {showNotes ?
                                    <>
                                        <textarea placeholder='Nhập yêu cầu..' onChange={(e) => setNote(e.target.value)} />
                                        <button onClick={putContent}>Lưu</button>
                                    </>
                                    :
                                    null
                                }
                            </span>
                        }
                        {phanquyenmodal === true &&
                            <span className='note'>
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <b style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: '#ae8f3d' }}><CiCirclePlus size={25} />Yêu cầu từ người dùng</b>
                                    <time style={{ fontSize: '9pt' }}>{dates}</time>
                                </span>
                                <span><b>Người gửi: {nameten || 'Trống !'}</b></span>
                                <textarea placeholder='Nhập ghi chú..' value={notes || 'Không có yêu cầu nào từ người dùng'} disabled />
                            </span>
                        } */}
                    </span>
                    <span>
                        <h2>Xem trước</h2>
                        <iframe
                            src={iframeLink}
                            title="Preview"
                            className='view_iframe'
                        ></iframe>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ContentModal;
