import React, { useState, useEffect } from 'react';
import { api } from './api';
import Chat from './Chat';

function VideoList() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await api.get('/videos');
                setVideos(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchVideos();
    }, []);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            <div>
                {/* Задаем белый цвет жестко прямо здесь */}
                <h2 style={{ color: '#ffffff', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>Видеолента</h2>
                <div style={{ display: 'grid', gap: '20px' }}>
                    {videos.map(video => (
                        <div key={video.id} className="video-card">
                            <h3 style={{ color: '#ffffff' }}>{video.title}</h3>
                            <p style={{ color: '#e0e0e0' }}>Автор: {video.author}</p>
                            <video controls style={{ width: '100%', borderRadius: '6px', backgroundColor: '#000' }}>
                                <source src={video.stream_url} type="video/mp4" />
                            </video>
                        </div>
                    ))}
                    {videos.length === 0 && <p style={{ color: '#ffffff' }}>Видео пока нет.</p>}
                </div>
            </div>
            <div>
                <Chat />
            </div>
        </div>
    );
}
export default VideoList;