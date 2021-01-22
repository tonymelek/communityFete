import React, { useContext, useEffect } from 'react'
import MyOrders from '../components/MyOrders'
import Notifier from '../components/Notifier'
import UserHeader from '../components/UserHeader'
import API from '../utils/API';
import AppContext from '../utils/AppContext';

import { useHistory } from 'react-router-dom';

export default function OrderTracker() {
    const history = useHistory()
    const { dispatch, state } = useContext(AppContext);
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
    return (
        <div>
            {/* <Notifier /> */}
            <h1>Orders Tracking</h1>
            <UserHeader />
            <MyOrders />
        </div>
    )
}


