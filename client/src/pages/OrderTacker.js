import React, { useContext, useEffect, useState } from 'react'
import MyOrders from '../components/MyOrders'
import Notifier from '../components/Notifier'

import API from '../utils/API';
import AppContext from '../utils/AppContext';
import socketIOClient from "socket.io-client";
import { useHistory } from 'react-router-dom';
import UserFooter from '../components/user/UserFooter';
import UserHeader from '../components/common/UserHeader';

export default function OrderTracker() {
    const history = useHistory()
    const [myOrders, setMyOrders] = useState([])
    const [separators, setSeparators] = useState([])
    const [loading, setLoading] = useState(true)
    const { dispatch, state } = useContext(AppContext);
    useEffect(() => {
        const socket = socketIOClient();
        let tempToken = localStorage.getItem("conmmFete")
        if (tempToken === null) {
            history.replace(`/`)
            return
        }

        API.getThisUser(tempToken).then(res => {
            if (res.data.role !== "user") {
                return history.replace(`/${res.data.role}`)
            }
            socket.emit("userId", res.data.email)
            socket.on('activeOrders', data => {
                setLoading(false)
                setSeparators([...new Set(data.map(item => item.order_status !== 'received' ? item.order_custom_id : null).filter(el => el !== null))])
                setMyOrders(data)

            })
            socket.on('userOrders', data => {
                setSeparators([...new Set(data.map(item => item.order_status !== 'received' ? item.order_custom_id : null).filter(el => el !== null))])
                setMyOrders(data)
                setLoading(false)

            })
            dispatch({ type: 'update_token', token: res.data.token })
            dispatch({ type: 'update_balance', balance: res.data.balance })
            dispatch({ type: 'update_role', role: res.data.role })
            dispatch({ type: 'update_email', email: res.data.email })

        })
            .catch(err => console.warn(err))
        return () => {
            socket.disconnect()
        }
    }, [])
    return (
        <div className="container user__main">

            <div className="d-flex flex-column main__flex__container ">
                <Notifier />
                <UserHeader state={state} />
                <div className="flex__main__components">
                    <div className="pt-2 px-2">
                        <MyOrders myOrders={myOrders} loading={loading} separators={separators} />

                    </div>
                    <div id="Order-now" className="pt-4">

                    </div>

                </div>

                <UserFooter />
            </div>

        </div>

    )
}


