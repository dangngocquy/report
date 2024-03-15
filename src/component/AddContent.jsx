import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { API_URL } from '../api';

function AddContent({ closeModal }) {
    const [link, setLink] = useState('');
    const [isWebpage, setIsWebpage] = useState(true);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [iframeLoading, setIframeLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [inputError, setInputError] = useState('');

    useEffect(() => {
        const handleOnlineStatusChange = () => {
            setIsOnline(navigator.onLine);
        };

        window.addEventListener('online', handleOnlineStatusChange);
        window.addEventListener('offline', handleOnlineStatusChange);

        return () => {
            window.removeEventListener('online', handleOnlineStatusChange);
            window.removeEventListener('offline', handleOnlineStatusChange);
        };
    }, []);

    const handleInputChange = (event) => {
        const inputLink = event.target.value;
        setLink(inputLink);
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        const iframeRegex = /<iframe.*?src=['"](.*?)['"]/;

        if (!inputLink) {
            setInputError('Vui lòng nhập Liên kết.');
        } else if (iframeRegex.test(inputLink)) {
            const iframeSrcMatch = inputLink.match(iframeRegex);
            const iframeSrc = iframeSrcMatch && iframeSrcMatch[1];
            setIframeLoading(true);
            setIsWebpage(true);
            setLink(iframeSrc);
        } else if (!urlRegex.test(inputLink) && inputLink.indexOf('.') === -1) {
            setInputError('Vui lòng nhập đường dẫn chính xác.');
        } else {
            setInputError('');
        }

        setIsWebpage(urlRegex.test(inputLink) || inputLink.indexOf('.') !== -1);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleIframeLoad = () => {
        setIframeLoading(false);
    };

    const getIframeSrc = () => {
        if (isWebpage && !link.startsWith('http://') && !link.startsWith('https://')) {
            return `http://${link}`;
        }
        return link;
    };

    const postContent = async () => {
        try {
            if (!link || !title) {
                setInputError('Vui lòng nhập đầy đủ thông tin.');
                return;
            }

            setInputError('');

            const apiUrl = `${API_URL}/content/add`;

            const requestData = {
                link,
                title,
            };

            const response = await axios.post(apiUrl, requestData);

            if (response.data.success) {
                console.log('Content added successfully');
                alert('Thêm thành công !')
                closeModal();
            } else {
                console.error('Failed to add content:', response.data.error);
            }
        } catch (error) {
            console.error('Error adding content:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="flex-niso-report-iframe">
                    <span style={{ marginRight: '2rem' }}>
                        <h2>Embed code</h2>
                        <label style={{ display: "flex", gap: '10px', flexDirection: 'column', marginTop: '20px' }}>
                            <b>Nhập tiêu đề BI</b>
                            <input
                                type="text"
                                placeholder="Nhập tiêu đề BI"
                                className="input1"
                                id="titleInput"
                                value={title}
                                onChange={handleTitleChange}
                            />
                        </label>
                        <label style={{ display: "flex", gap: '10px', flexDirection: 'column', marginTop: '20px' }}>
                            <b>Nhập liên kết hoặc iframe BI</b>
                            <input
                                type="text"
                                placeholder="Nhập liên kết BI"
                                className={`input1 ${inputError ? 'error' : ''}`}
                                value={link}
                                onChange={handleInputChange}
                            />
                            {inputError && <span style={{ textAlign: 'left', fontSize: '9pt', color: 'rgba(255, 96, 98, 1)' }}>{inputError}</span>}
                        </label>
                        <span className='button-box-modal'>
                            <button className='text-sm' onClick={postContent}>Thêm</button>
                            <button onClick={closeModal} className='text-sm'>Close</button>
                        </span>
                    </span>
                    <span>
                        <h2>Xem trước</h2>
                        {link && isWebpage ? (
                            <div>
                                {iframeLoading && <div className='box-none'>Đang tải chờ xí nhé...</div>}
                                <iframe
                                    src={getIframeSrc()}
                                    title="Preview"
                                    style={{ marginTop: '20px', display: iframeLoading ? 'none' : 'block' }}
                                    onLoad={handleIframeLoad}
                                    className='view_iframe'
                                ></iframe>
                            </div>
                        ) : (
                            <div className='box-none'>
                                {link ? (
                                    isWebpage ? (
                                        isOnline ? (
                                            "Liên kết không hợp lệ. Hãy chắc chắn rằng đây là một đường dẫn đúng."
                                        ) : (
                                            "Mất kết nối mạng. Vui lòng kiểm tra kết nối của bạn."
                                        )
                                    ) : (
                                        "Bạn nhập sai đường dẫn."
                                    )
                                ) : (
                                    "Bạn chưa nhập liên kết."
                                )}
                            </div>
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default AddContent;
