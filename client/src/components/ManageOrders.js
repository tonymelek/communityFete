import React, { useContext, useEffect, useState } from 'react'
import API from '../utils/API';
import AppContext from '../utils/AppContext';

export default function ManageOrders() {
    const { state } = useContext(AppContext);
    const [menu, setMenu] = useState([])
    const [orders, setOrders] = useState([])
    useEffect(() => {
        API.getMenu(state.token)
            .then(res => {
                setMenu(res.data)
            })
            .catch(err => console.log(err.response))


        const socket = io();
        socket.emit("userId", state.user_email)
        socket.on('shopConnection', data => {
            console.log(data);
        })
        socket.on('orderToShop', data => {

            setOrders([...orders, data])
        })
    }, [])

    return (
        <div>
            {state.user_email}

            {orders.map(item => <div key={item.id} className="card my-2 p-2 d-flex flex-row flex-wap justify-content-between">
                <div>
                    <p><strong>{item.email}-{item.id}</strong></p>
                    <p>{item.order_status}-${item.total}</p>
                    <div>{JSON.parse(item.order_items)
                        .map(orderItem => <>
                            <p>{menu.filter(menuItem => menuItem.id == orderItem.id)[0].item_name}x{orderItem.qty}</p>
                        </>)
                    }
                    </div>
                </div>
                <div>
                    <img src={item.item_pic} height="150" alt={item.item_name} />
                </div>
            </div>)}
        </div>
    )
}



