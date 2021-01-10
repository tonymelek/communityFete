import axios from 'axios'
import { useHistory } from "react-router-dom";


export default {
    getUsers(token) {
        return axios({
            method: 'get',
            url: '/api/users',
            headers: {
                authorization: `bearer ${token}`
            }
        })
    },
    login(email, password) {
        return axios({
            method: 'post',
            url: '/api/login',
            data: {
                email: email.current.value, password: password.current.value
            }
        })
    },
    signup(email, password) {
        return axios({
            method: 'post',
            url: '/api/signup',
            data: {
                email: email.current.value, password: password.current.value
            }
        })
    }
}