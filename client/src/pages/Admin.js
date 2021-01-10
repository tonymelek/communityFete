import React, { useState, useEffect, useContext } from 'react'
import API from '../utils/API'
import AppContext from '../utils/AppContext';
export default function Admin() {
    const [users, setUsers] = useState([])
    const { dispatch, state } = useContext(AppContext);
    useEffect(() => {
        API.getUsers(state.token)
            .then(res => setUsers(res.data))
            .catch(err => console.log(err.response))

    }, [])
    return (
        <div className="admin">
            <h1>{JSON.stringify(users)}</h1>
        </div>
    )
}

