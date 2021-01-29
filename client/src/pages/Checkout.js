import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import UserFooter from '../components/user/UserFooter';
import API from '../utils/API';
import AppContext from '../utils/AppContext';
import './Checkout.css'
import socketIOClient from "socket.io-client";
import ResviseItems from '../components/checkout/ResviseItems';
import UserHeader from '../components/common/UserHeader';
import Notifier from '../components/Notifier';

export default function Checkout() {
    const { dispatch, state } = useContext(AppContext);
    const [myOrders, setMyOrders] = useState([])
    let stopExec = false
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
        if (state.user_email === "" || stopExec) {
            return
        }
        if (state.role !== "" && state.role !== "user") {
            history.replace(`/${state.role}`)
        }
        stopExec = true
        const socket = socketIOClient();


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
                <UserHeader state={state} />
                <div className="flex__main__components">
                    <div className="pt-2 px-2 user__revise">
                        <ResviseItems props={{ state, dispatch, history, socketIOClient }} />

                    </div>
                    <div id="Order-now" className="pt-4">

                    </div>

                </div>

                <UserFooter />
            </div>

        </div>




    )
}


