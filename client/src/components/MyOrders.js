import React, { useContext, useEffect, useState } from 'react'
import API from '../utils/API'
import AppContext from '../utils/AppContext'
import socketIOClient from "socket.io-client";
import Loading from './common/Loading'
export default function MyOrders() {
    const [myOrders, setMyOrders] = useState([])
    const [separators, setSeparators] = useState([])
    const { state } = useContext(AppContext)
    const [loading, setLoading] = useState(true)
    let stopExec = false

    useEffect(() => {
        if (state.user_email === "" || stopExec) {
            return
        }
        stopExec = true;
        const socket = socketIOClient();
        socket.emit("userId", state.user_email)
        socket.on('userOrders', data => {
            setSeparators([...new Set(data.map(item => item.order_status !== 'received' ? item.order_custom_id : null).filter(el => el !== null))])
            setMyOrders(data)
            setLoading(false)
        })

        socket.on('activeOrders', data => {
            setSeparators([...new Set(data.map(item => item.order_status !== 'received' ? item.order_custom_id : null).filter(el => el !== null))])
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


                    {separators.map(separator => <div key={separator} className="card  myorder__items m-2 ">
                        <div className="card-header bg-header">
                            <h4 className="text-center">Order#<span className="text-danger"> {separator} </span>- Shop: <span className="text-primary">{{ ...{ ...myOrders.find(order => order.order_custom_id === separator) }.Shop }.name}</span></h4>
                        </div>
                        <div className={`card-body d-flex  justify-content-between myorder__items ${{ ...myOrders.find(order => order.order_custom_id === separator) }.order_status === 'paid' ? 'bg-paid' : 'bg-ready'}`}>
                            <div>
                                <h5 className="m-1 p-0">Items</h5>
                                {myOrders.filter(orders => orders.order_custom_id === separator)
                                    .map(order => <div key={order.id}>
                                        {<ul className="p-1 m-0 list-unstyled">
                                            <li ><>{order.Menu.item_name}x{order.item_qty}</></li>
                                        </ul>}
                                    </div>)}
                            </div>
                            <div>
                                <h1>${{ ...myOrders.find(order => order.order_custom_id === separator) }.order_total}</h1>
                                <h5>&#8226; {{ ...myOrders.find(order => order.order_custom_id === separator) }.order_status}</h5>
                            </div>
                        </div>
                    </div>)}

                </div>
            </div>
        </>
    )
}


