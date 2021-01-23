import React, { useState, useEffect, useContext } from 'react'
import API from '../utils/API'
import AppContext from '../utils/AppContext';
import { useHistory } from "react-router-dom";
import './Admin.css'
import Notifier from '../components/Notifier';
import AdminUsers from '../components/AdminUsers';
import AdminMerchants from '../components/AdminMerchants';
export default function Admin() {


    const history = useHistory();
    const { dispatch } = useContext(AppContext);
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
        <div className="container">
            <Notifier />
            <div className="row">
                <div className="col-12 col-md-6 admin__users__container  d-flex flex-column mx-auto mt-3 p-2">
                    <AdminUsers />
                </div>
                <div className="col-12 col-md-6 admin__users__container  d-flex flex-column mx-auto mt-3 p-2">
                    <AdminMerchants />
                </div>
            </div>
        </div>
    )
}