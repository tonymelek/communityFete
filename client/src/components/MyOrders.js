import React, { useContext, useEffect, useState } from 'react'
import API from '../utils/API'
import AppContext from '../utils/AppContext'
import socketIOClient from "socket.io-client";
import Loading from './common/Loading'
export default function MyOrders() {
    const [myOrders, setMyOrders] = useState([])
    const [menu, setMenu] = useState([])
    const { state } = useContext(AppContext)
    const [loading, setLoading] = useState(true)
    let stopExec = false

    useEffect(() => {
        if (state.user_email === "" || stopExec) {
            return
        }
        stopExec = true;
        const socket = socketIOClient();
        API.getMenu_user()
            .then(res => {
                setMenu(res.data);
            })
            .catch(err => console.log(err.response))

        socket.emit("userId", state.user_email)
        socket.on('userOrders', data => {
            setMyOrders(data)
            setLoading(false)
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
        <>
            <Loading loading={loading} />
            <div className={`${loading && 'hazy'}`}>

                <h3 className="text-center py-3">Track Active Orders</h3>
                <div className="d-flex flex-wrap justify-content-center">
                    {myOrders.filter(order => order.order_status !== "received").map(order => <div key={order.id} className="card  myorder__items m-2 ">
                        <div className="card-header bg-header">
                            <h4 className="text-center">Order#<span className="text-danger"> {order.id} </span>- Shop: <span className="text-primary">{order.Shop.name}</span></h4>
                        </div>
                        <div className={`card-body d-flex  justify-content-between myorder__items  ${order.order_status === 'paid' ? 'bg-paid' : 'bg-ready'}`}>

                            <div>{<div>
                                <h5 className="m-1 p-0">Items</h5>
                                <ul className="p-1 list-unstyled">
                                    {JSON.parse(order.order_items)

                                        .map((orderItem, index) => <div key={`orderItem-${index}`}>

                                            <li ><>{{ ...menu.find(menuItem => parseInt(menuItem.id) === parseInt(orderItem.id)) }.item_name}x{orderItem.qty}</></li>
                                        </div>)
                                    }</ul>
                            </div>}</div>
                            <div>
                                <h1>${order.order_total}</h1>
                            </div>
                        </div>
                    </div>)}
                </div>
            </div>
        </>
    )
}


