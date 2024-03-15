import { useState } from 'react';

function Modal() {
    const [showModalid, setShowModalid] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const openModalid = (id) => {
        setShowModalid(id);
    };

    const closeModalid = () => {
        setShowModalid(null);
    };
    return {
        showModal,
        showModalid,
        openModal,
        openModalid,
        closeModal,
        closeModalid
    }
}
export default Modal;