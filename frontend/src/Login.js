import React, { useState } from 'react';
import { api } from './api';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', formData);
            localStorage.setItem('token', response.data.access_token);
            window.location.href = '/';
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка входа');
        }
    };

    return (
        <div className="auth-form">
            <h2>Авторизация</h2>
            {error && <p className="error-text">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="email" name="email" placeholder="Электронная почта" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <input type="password" name="password" placeholder="Код доступа" onChange={handleChange} required />
                </div>
                <button type="submit" className="btn-primary">Отправить</button>
            </form>
        </div>
    );
}
export default Login;