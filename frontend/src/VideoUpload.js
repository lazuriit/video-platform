import React, { useState } from 'react';
import { api } from './api';

function VideoUpload() {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('video', file);
        formData.append('title', title);

        try {
            const response = await api.post('/videos/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage(response.data.message);
        } catch (err) {
            setMessage(err.response?.data?.error || 'Ошибка загрузки');
        }
    };

    return (
        <div className="auth-form">
            <h2>Загрузка видео</h2>
            {message && <p className="error-text" style={{color: '#27ae60'}}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="text" placeholder="Название видео" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <input type="file" accept="video/*" onChange={handleFileChange} required />
                </div>
                <button type="submit" className="btn-primary">Загрузить</button>
            </form>
        </div>
    );
}
export default VideoUpload;