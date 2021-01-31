import React, { useEffect, useContext, useState } from 'react'
import API from '../utils/API'
import AppContext from '../utils/AppContext';
import { useHistory } from "react-router-dom";
import './Admin.css'
import Notifier from '../components/Notifier';
import AdminUsers from '../components/AdminUsers';
import AdminMerchants from '../components/AdminMerchants';
import Header from '../components/common/Header';
import SideMenu from '../components/common/SideMenu';
import AdminDashboard from '../components/AdminDashboard';
export default function Admin() {

    const [side, setSide] = useState('d-none')
    const sideMenu = ['Dashboard', 'Manage-Shops', 'Manage-Users']
    const history = useHistory();
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
        <div className="container admin__main">
            <Notifier />



            <div className="d-flex flex-column main__flex__container ">
                <Header state={state} sideDisplay={{ side, setSide }} />
                <div className="flex__main__components">
                    <SideMenu side={{ side, setSide }} items={sideMenu} />
                    <div className="admin__component mx-2 mb-10" id="Dashboard">
                        <AdminDashboard state={state} />
                    </div>
                    <div className="admin__component mx-2 mb-10" id="Manage-Shops">
                        <AdminMerchants />
                    </div>
                    <div className="admin__component mx-2 mb-10" id="Manage-Users">
                        <AdminUsers />
                    </div>
                </div>

            </div>
        </div>
    )
}