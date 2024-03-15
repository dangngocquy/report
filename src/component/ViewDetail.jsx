import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { useParams } from 'react-router-dom';
import { API_URL } from '../api';

const ViewDetail = () => {
  const { keys } = useParams();
  const [department, setDepartment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axios.get(`${API_URL}/content/views/${keys}`);
        setDepartment(response.data.data);
      } catch (error) {
        setError(error.message || 'An error occurred while fetching data');
      }
    };

    fetchDepartment();
  }, [keys]);

  return (
    <div className='hidden-niso'>
      {department ? (
        <div>
          <title>NISO - {department.title}</title>
          <iframe
            src={department.link}
            title="Preview"
            className='view_details'
          ></iframe>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default ViewDetail;
