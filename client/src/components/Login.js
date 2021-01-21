import React, { useRef, useContext } from 'react'
import { useHistory } from "react-router-dom";
import './login.css'
import axios from 'axios'
import AppContext from '../utils/AppContext';
import API from '../utils/API';
export default function Login() {
    const email = useRef('');
    const password = useRef('');
    const history = useHistory();
    const { dispatch, state } = useContext(AppContext);
    const handleLogin = (e, email, password) => {
        e.preventDefault()
        API.login(email, password).then(res => {
            dispatch({ type: 'update_token', token: res.data.token })
            dispatch({ type: 'update_balance', balance: res.data.balance })
            dispatch({ type: 'update_role', role: res.data.role })
            dispatch({ type: 'update_email', email: res.data.email })
            localStorage.setItem("conmmFete", res.data.token)
            history.push(`/${res.data.role}`)
        })
            .catch(err => console.warn(err.response.data))
    }
    const handleSignup = (e, email, password) => {
        e.preventDefault()
        API.signup(email, password).then(res => {
            dispatch({ type: 'update_token', token: res.data.token })
            dispatch({ type: 'update_balance', balance: res.data.balance })
            dispatch({ type: 'update_role', role: res.data.role })
            dispatch({ type: 'update_email', email: res.data.email })
            localStorage.setItem("conmmFete", res.data.token)
            history.push(`/${res.data.role}`)
        })
            .catch(err => console.warn(err.response.data))
    }
    return (
        <>
            <h3 className="text-center mt-3">Login</h3>

            <div className="login card mx-auto p-3 mt-3">
                <form >

                    <label htmlFor="login__email">Email</label>
                    <input type="email" name="login__email" id="login__email" ref={email} autoComplete="email" placeholder="your Email" className="form-control" />
                    <label htmlFor="login__password">Password</label>
                    <input type="password" name="login__password" id="login__password" autoComplete="current-password" ref={password} className="form-control" />

                    <button type="submit" className="btn btn-primary my-2 w-100" onClick={e => handleLogin(e, email, password)}>Login</button>
                    <p className="fst-italic">If you do not have an account please Sign up first, You only need to enter your email and password</p>

                </form>
                <button type="submit" className="btn btn-outline-primary my-2 w-100" onClick={e => handleSignup(e, email, password)}>Sign Up</button>

            </div>
        </>
    )
}

