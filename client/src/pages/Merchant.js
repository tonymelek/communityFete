import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom';
import CreateMenuItem from '../components/CreateMeuItem'
import GetItems from '../components/GetItems'
import ManageOrders from '../components/ManageOrders';
import Notifier from '../components/Notifier';
import API from '../utils/API';
import AppContext from '../utils/AppContext';

export default function Merchant() {
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
        if (state.role !== "" && state.role !== "merchant") {
            history.replace(`/${state.role}`)
        }
    }, [state])

    return (
        <div className="container">
            <Notifier />
            <div className="row">
                <div className="col-md-6 col-12">View Orders
                <ManageOrders />
                </div>

                <div className="col-md-6 col-12">Create Menu Item
            <CreateMenuItem />
                    <GetItems />
                </div>
            </div>
        </div>
    )
}


