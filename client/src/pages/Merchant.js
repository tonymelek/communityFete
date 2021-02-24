import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom';
import Notifier from '../components/Notifier';
import API from '../utils/API';
import AppContext from '../utils/AppContext';
import './Merchant.css'
import socketIOClient from "socket.io-client";
import CreateMenuItem from '../components/Merchant/CreateMeuItem';
import Header from '../components/common/Header';
import ManageOrders from '../components/Merchant/ManageOrders';
import GetItems from '../components/Merchant/GetItems';
import MerchantFooter from '../components/Merchant/MerchantFooter';
import SideMenu from '../components/common/SideMenu';
import MerchantDashboard from '../components/Merchant/MerchantDashboard';

export default function Merchant() {
    const { dispatch, state } = useContext(AppContext);
    const [create_appear, setCreate_appear] = useState('d-none')
    const [side, setSide] = useState('d-none')
    const sideMenu = ['Dashboard', 'Manage-Orders', 'Update-Menu']
    const history = useHistory();
    const [menu, setMenu] = useState([])
    const [oldOrders, setOldOrders] = useState([])
    const [sockets, setSockets] = useState({})

    useEffect(() => {
        let tempToken = localStorage.getItem("conmmFete")
        if (tempToken === null) {
            history.replace(`/`)
            return
        }
        API.getThisUser(tempToken).then(res => {
            if (res.data.role !== "" && res.data.role !== "merchant") {
                history.replace(`/${res.data.role}`)
            }

            const socket = socketIOClient();
            setSockets(socket)
            API.getMenu(res.data.token)
                .then(res => {
                    setMenu(res.data)
                })
                .catch(err => console.log(err.response))
            socket.emit("userId", res.data.email)
            socket.on('shopConnection', data => {
                console.log(data);
            })
            socket.on('shopOrders', data => {
                setOldOrders(data)
            })
            dispatch({ type: 'update_token', token: res.data.token })
            dispatch({ type: 'update_balance', balance: res.data.balance })
            dispatch({ type: 'update_role', role: res.data.role })
            dispatch({ type: 'update_email', email: res.data.email })
            return () => socket.disconnect();
        })
            .catch(err => console.warn(err))

    }, [])





    return (
        <div className="container merchant__main">
            <Notifier />

            <CreateMenuItem values={{ create_appear, setCreate_appear }} />
            <div className="d-flex flex-column main__flex__container ">

                <Header state={state} sideDisplay={{ side, setSide }} />

                <div className="flex__main__components">
                    <SideMenu side={{ side, setSide }} items={sideMenu} />
                    <div className=" mx-2 merchant__section mb-10" id="Dashboard">

                        <MerchantDashboard orders={oldOrders} state={state} menu={menu} />

                    </div>
                    <div className=" mx-2 merchant__section mb-10" id="Manage-Orders">

                        <ManageOrders myOrders={oldOrders} socket={sockets} />

                    </div>

                    <div className=" merchant__section mb-10" id="Update-Menu">
                        <button onClick={() => setCreate_appear('d-block animate__animated animate__zoomIn ')} className="btn btn-outline-danger create__new__item__button cursor-pointer">Create New Menu Item </button>

                        <GetItems />

                    </div>

                </div>
                <MerchantFooter orders={oldOrders} state={state} />
            </div>
        </div>
    )
}




