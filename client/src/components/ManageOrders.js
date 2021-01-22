import React, { useContext, useEffect, useState } from 'react'
import API from '../utils/API';
import AppContext from '../utils/AppContext';
import socketIOClient from "socket.io-client";
import { useHistory } from 'react-router-dom';

export default function ManageOrders() {
    const { state } = useContext(AppContext);
    const [menu, setMenu] = useState([])
    const [oldOrders, setOldOrders] = useState([])
    const history = useHistory();
    let stopExec = false

    useEffect(() => {
        if (state.token === "" || stopExec) {
            return
        }
        stopExec = true
        const socket = socketIOClient();
        API.getMenu(state.token)
            .then(res => {
                setMenu(res.data)
            })
            .catch(err => console.log(err.response))
        socket.emit("userId", state.user_email)
        socket.on('shopConnection', data => {
            console.log(data);
        })
        socket.on('oldOrders', data => {
            console.log(data);
            console.log("I came here");
            setOldOrders(data)
        })

        return () => socket.disconnect();

    }, [state])



    const updateOrderStatus = (e, order_id, status) => {
        e.preventDefault();
        const socket = socketIOClient();
        socket.emit('updateOrderStatus', {
            id: order_id,
            status
        })

        let tempOrders = oldOrders.map(order => {
            if (order.id === order_id) {
                order['order_status'] = status;
            }
            return order
        })
        setOldOrders(tempOrders)


        // socket.disconnect();
    }
    return (
        <div>
            {state.user_email}
            {/* {JSON.stringify(oldOrders)} */}
            {oldOrders.filter(order => order.order_status !== "received").map(item => <div key={item.id} className="card my-2 p-2">
                <p>Order # :{item.id}</p>
                <p>User email :{item.User.email}</p>
                <p>Order Status:{item.order_status}</p>
                <div>{JSON.parse(item.order_items)
                    .map((orderItem, index) => <div key={`orderItem-${index}`}>
                        <p>{menu.filter(menuItem => menuItem.id == orderItem.id)[0].item_name}x{orderItem.qty}</p>
                    </div>)
                }
                    <button className="btn btn-warning d-block w-100 my-2" onClick={e => updateOrderStatus(e, item.id, "ready")}>Ready</button>
                    <button className="btn btn-success d-block w-100 my-2" onClick={e => updateOrderStatus(e, item.id, "received")}>Collected</button>
                </div>

            </div>)}

        </div>
    )
}



