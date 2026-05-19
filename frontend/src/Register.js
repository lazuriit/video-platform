import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';

function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка регистрации');
        }
    };

    return (
        <div className="auth-form">
            <h2>Регистрация</h2>
            {error && <p className="error-text">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="email" name="email" placeholder="Электронная почта" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <input type="text" name="first_name" placeholder="Имя" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <input type="text" name="last_name" placeholder="Фамилия" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <input type="password" name="password" placeholder="Код доступа" onChange={handleChange} required />
                </div>
                <button type="submit" className="btn-primary">Отправить</button>
            </form>
        </div>
    );
}
export default Register;