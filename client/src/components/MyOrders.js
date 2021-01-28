import React, { useContext, useEffect, useState } from 'react'
import API from '../utils/API'
import AppContext from '../utils/AppContext'
import socketIOClient from "socket.io-client";
export default function MyOrders() {
    const [myOrders, setMyOrders] = useState([])
    const [menu, setMenu] = useState([])
    const { state } = useContext(AppContext)
    let stopExec = false

    useEffect(() => {
        if (state.user_email === "" || stopExec) {
            return
        }
        stopExec = true
        const socket = socketIOClient();
        console.log('here');
        API.getMenu_user()
            .then(res => {
                setMenu(res.data);
            })
            .catch(err => console.log(err.response))

        socket.emit("userId", state.user_email)
        socket.on('userOrders', data => {
            console.log(data);
            setMyOrders(data)
        })

        socket.on('activeOrders', data => {
            console.log(data);
            setMyOrders(data)
        })
        socket.emit('newOrder', myOrders)
        return () => {
            socket.disconnect()
        }
    }, [state])


    return (
        <div>

            {/* {JSON.stringify(myOrders)} */}
            {myOrders.map(order => <div key={order.id} className="card my-2 p-2">
                <p>Order #:{order.id}- Shop: {order.Shop.name}- Status: {order.order_status} - Order Total: ${order.order_total}</p>
                <div>{<div>{JSON.parse(order.order_items)
                    .map((orderItem, index) => <div key={`orderItem-${index}`}>
                        <p>{menu.filter(menuItem => menuItem.id == orderItem.id)[0].item_name}x{orderItem.qty}</p>
                    </div>)
                }
                </div>}</div>
            </div>)}
        </div>
    )
}


