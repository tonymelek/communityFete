import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import UserHeader from '../components/UserHeader'
import UsersMenu from '../components/UsersMenu'
import API from '../utils/API';
import AppContext from '../utils/AppContext';

export default function User() {
    const { dispatch, state } = useContext(AppContext);
    const history = useHistory();
    useEffect(() => {
        let tempToken = localStorage.getItem("conmmFete")
        if (tempToken === null) {
            history.replace(`/`)
            return
        }
        API.getThisUser(tempToken).then(res => {
            dispatch({ type: 'update_token', token: res.data.token })
            dispatch({ type: 'update_balance', balance: res.data.balance })
            dispatch({ type: 'update_role', role: res.data.role })
            dispatch({ type: 'update_email', email: res.data.email })

        })
            .catch(err => console.warn(err))

    }, [])
    useEffect(() => {
        if (state.role !== "" && state.role !== "user") {
            history.replace(`/${state.role}`)
        }
    }, [state])
    return (
        <div>
            <UserHeader />
            <UsersMenu />
        </div>
    )
}

