import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Popup from 'reactjs-popup';
import requireAuth from '../middleware/RequireAuth';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import {
  getMaterialFileIcon,
  getMaterialFolderIcon,
  getVSIFileIcon,
  getVSIFolderIcon,
} from "file-extension-icon-js";




function HomePage() {


  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/document/documents', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDocuments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('document', selectedFile);
      setLoading(true); // show loader
      await axios.post('/api/document/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false); // hide loader
      setFileName('');
      setSelectedFile(null);
      document.querySelector('input[type="file"]').value = ''; // clear selected file
      fetchDocuments();
  
      toast.success('File uploaded successfully');
  
      setOpen(false)
    } catch (error) {
      setLoading(false); // hide loader in case of error
      console.error(error);
    }
  };
  
  

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      setLoading(true); // show spinner
      await axios.delete(`/api/document/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false); // hide spinner
      fetchDocuments();
      toast.success('Document deleted successfully');
      setOpen(false)
    } catch (error) {
      console.error(error);
      setLoading(false); // hide spinner in case of error
    }
  };
  
  const handleDownload = async (id, fileName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/document/documents/${id}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
  
      toast.success('File downloaded successfully'); // show toast message
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
          
      <h1>Documents</h1>
      <div className="form-container">
  <form className="form" onSubmit={handleFileUpload}>
    <label className='file-input'>
      Select file:‎ ‎ 
      <input type="file" onChange={handleFileSelect} />
    </label>
    <button className="upload-btn" type="submit" disabled={!selectedFile} onClick={() => {setOpen(true)}}>
      Upload
    </button>
    {fileName && <p>{fileName}</p>}
  </form>
</div>
      <Popup open={open}>
      {loading && <Loader type="Oval" color="#00BFFF" height={150} width={150} />}
      </Popup>

      <div className="cards">
  {documents.map((document) => (
    <div className="card" key={document._id}>
      <img src={`${getMaterialFileIcon(document.fileName)}`} alt="file icon" className="card__image" />
      <div className="card__content">
        <h2 className="card__title">{document.fileName}</h2>
        <div className="card__actions">
          <button onClick={() => {handleDelete(document._id);setOpen(true)}}><DeleteForeverIcon/></button>
          <button onClick={() => handleDownload(document._id, document.fileName)}>
          <CloudDownloadIcon/>
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

    </div>
  );
}

export default requireAuth(HomePage);