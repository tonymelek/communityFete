import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import Header from '../components/common/Header';
import SideMenu from '../components/common/SideMenu';
import UserDashboard from '../components/user/UserDashboard';
import UserFooter from '../components/user/UserFooter';
import UsersMenu from '../components/user/UsersMenu'
import API from '../utils/API';
import AppContext from '../utils/AppContext';
import './User.css'
import socketIOClient from "socket.io-client";
import Notifier from '../components/Notifier';


export default function User() {
    const { dispatch, state } = useContext(AppContext);
    const [myOrders, setMyOrders] = useState([])
    const [menu, setMenu] = useState([])
    let stopExec = false
    const history = useHistory();
    const [side, setSide] = useState('d-none')
    const sideMenu = ['Dashboard', "Order-now"]
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
        if (state.user_email === "" || stopExec) {
            return
        }
        if (state.role !== "" && state.role !== "user") {
            history.replace(`/${state.role}`)
        }
        stopExec = true
        const socket = socketIOClient();
        API.getMenu_user()
            .then(res => {
                setMenu(res.data.map(item => { return { ...item, expand: false, qty: 0 } }))

            })
            .catch(err => console.log(err.response))

        socket.emit("userId", state.user_email)
        socket.on('userOrders', data => {
            setMyOrders(data)
        })

        socket.on('activeOrders', data => {
            setMyOrders(data)
        })
        socket.emit('newOrder', myOrders)
        return () => {
            socket.disconnect()
        }
    }, [state])

    return (
        <div className="container user__main">

            <div className="d-flex flex-column main__flex__container ">
                <Notifier />
                <Header state={state} sideDisplay={{ side, setSide }} />

                <div className="flex__main__components">
                    <SideMenu side={{ side, setSide }} items={sideMenu} />
                    <div className="pt-4 user__dashboard" id="Dashboard">
                        <UserDashboard orders={myOrders} menu={menu} />
                    </div>
                    <div id="Order-now" className="pt-2">
                        <UsersMenu history={history} />
                    </div>

                </div>

                <UserFooter />
            </div>

        </div>
    )
}

