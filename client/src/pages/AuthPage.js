import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const { loading, request, error, clearError } = useHttp()
    const [form, setForm] = useState({
        id: '',
        password: ''
    })

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const registerHandler = async () => {
        try {
            const data = await request('/signup', 'POST', JSON.stringify({...form}), {
                'Content-Type': 'application/json'
            })
            
            if ( data.message ) {
                return message(data.message)
            }
        } catch (e) {}
    }

    const loginHandler = async () => {
        try {
            const data = await request('/signin', 'POST', JSON.stringify({...form}), {
                'Content-Type': 'application/json'
            })
            
            if ( data.message ) {
                return message(data.message)
            }

            auth.login(data.accessToken, data.refreshToken)
        } catch (e) {}
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
            <div className="card blue-grey darken-1">
                <div className="card-content white-text">
                    <span className="card-title">Авторизация</span>
                    <div>
                        <div className="input-field">
                            <input 
                                placeholder="Введите email или телефон" 
                                id="emailOrPhone" 
                                type="text" 
                                name="id"
                                value={form.id}
                                onChange={changeHandler}
                            />
                            <label htmlFor="emailOrPhone">Email или телефон</label>
                        </div>
                        <div className="input-field">
                            <input 
                                placeholder="Введите пароль" 
                                id="password" 
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={changeHandler} 
                            />
                            <label htmlFor="password">Пароль</label>
                        </div>
                    </div>
                </div>
                <div className="card-action">
                    <button 
                        className="btn #ef6c00 orange darken-3 mr10"
                        onClick={loginHandler}
                        disabled={loading}
                    >
                        Войти
                    </button>
                    <button 
                        className="btn #00897b teal darken-1"
                        onClick={registerHandler}
                        disabled={loading}
                    >
                        Регистрация
                    </button>
                </div>
            </div>  
            </div>
        </div>
    )
}