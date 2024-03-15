import React, { useState, useEffect } from "react";
import axios from 'axios';
import { FaCameraRetro, FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import Modal from './Modal';
import ContentModal from './ContentModal';
import AddContent from './AddContent';
import { API_URL } from "../api";
import { Link } from "react-router-dom";

function Body({ phanquyen, name }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResultsCount, setSearchResultsCount] = useState(null);
    const {
        showModalid,
        openModalid,
        closeModalid,
        openModal,
        closeModal,
        showModal,
    } = Modal();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/content/all`);
                setData(response.data.data);
                setSearchResultsCount(response.data.data.length);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleIframeLoad = () => {
        setLoading(false);
    };

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const performSearch = async () => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
        if (!lowerCaseSearchTerm) {
            try {
                const response = await axios.get(`${API_URL}/content/all`);
                setData(response.data.data);
                setSearchResultsCount(response.data.data.length);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        } else {
            const filteredData = data.filter((item) =>
                item.title.toLowerCase().includes(lowerCaseSearchTerm)
            );
            setData(filteredData);
            setSearchResultsCount(filteredData.length);
        }
    };

    const handleEnterKeyPress = (event) => {
        if (event.key === "Enter") {
            performSearch();
        }
    };

    return (
        <div className="body-report-main">
            <title>NISO - Dashboard REPORT</title>
            <b>Tìm kiếm report</b>
            <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                <span className="flex-search-niso">
                    <input
                        type='text'
                        className='input1 flex1'
                        placeholder='Nhập tiêu đề report để tìm kiếm...'
                        value={searchTerm}
                        onChange={handleSearchTermChange}
                        onKeyPress={handleEnterKeyPress}
                    />
                    <button className="flex2 desktopicon" onClick={performSearch}>
                        Tìm kiếm
                    </button>
                    <CiSearch className="iconmenu mobileicon" size={25} />
                </span>
            </div>
            {searchResultsCount !== null && (
                <p style={{ marginBottom: '15px' }}>
                    {searchResultsCount === 0
                        ? "Không tìm thấy kết quả."
                        : `Tìm thấy ${searchResultsCount} kết quả.`}
                </p>
            )}
            <div className='grid-repost-niso'>
                {phanquyen && (
                    <div className='boddy-containers' onClick={openModal}>
                        <label className="border">
                            <FaPlus size={48} style={{ color: 'rgba(69, 175, 211, 0.6)' }} />
                        </label>
                    </div>
                )}
                {data.slice().reverse().map((item) => (
                    <div key={item.keys}>
                    {phanquyen === true && (
                    <div>
                        <div className='boddy-container' onClick={() => openModalid(item.keys)}>
                            <div className='main-container'>
                                {loading && <div className="box-none2">Loading...</div>}
                                <iframe
                                    src={item.link}
                                    title="Preview"
                                    style={{ width: '100%', height: '250px' }}
                                    className="iframe_view_containers"
                                    onLoad={handleIframeLoad}
                                    onLoadStart={() => setLoading(true)}
                                ></iframe>
                                <div className="overlay">
                                    <FaCameraRetro size={48} style={{ color: 'rgba(69, 175, 211, 0.6)' }} className="overlayMobil" />
                                </div>
                            </div>
                            <span style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                                <p style={{ fontSize: '25px' }}>{item.title}</p>
                            </span>
                        </div>
                        {showModalid && showModalid === item.keys && (
                            <ContentModal closeModalid={closeModalid} ten={name} nameten={item.name} key_link={item.link} name={item.title} id_keys={item.keys} phanquyenmodal={phanquyen} notes={item.note} dates={item.date} />
                        )}
                    </div>
                    )}
                    {phanquyen === false && (
                        <Link className='boddy-container' to={`/auth/dashboard/views/${item.keys}`}>
                            <div className='main-container'>
                                {loading && <div className="box-none2">Loading...</div>}
                                <iframe
                                    src={item.link}
                                    title="Preview"
                                    style={{ width: '100%', height: '250px' }}
                                    className="iframe_view_containers"
                                    onLoad={handleIframeLoad}
                                    onLoadStart={() => setLoading(true)}
                                ></iframe>
                                <div className="overlay">
                                    <FaCameraRetro size={48} style={{ color: 'rgba(69, 175, 211, 0.6)' }} className="overlayMobil" />
                                </div>
                            </div>
                            <span style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                                <p style={{ fontSize: '25px' }}>{item.title}</p>
                            </span>
                    </Link>
                    )}
                    </div>
                ))}
            </div>
            {showModal && <AddContent closeModal={closeModal} />}
        </div>
    );
}

export default Body;
