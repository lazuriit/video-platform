import React, { useState, useEffect } from 'react';
import { api } from './api';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');

    const fetchMessages = async () => {
        try {
            const response = await api.get('/chat');
            setMessages(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        try {
            await api.post('/chat', { text });
            setText('');
            fetchMessages();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="chat-container">
            <h3>Чат Вопрос / ответ</h3>
            <div className="chat-messages">
                {messages.map((m) => (
                    <div key={m.id} className="chat-message">
                        <strong>{m.author}</strong>
                        <p>{m.text}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="chat-form">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Написать сообщение..."
                />
                <button type="submit" className="btn-primary">Отправить</button>
            </form>
        </div>
    );
}
export default Chat;