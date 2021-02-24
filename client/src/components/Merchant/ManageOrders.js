import React, { useEffect, useState } from 'react'
import socketIOClient from "socket.io-client";
import Loading from '../common/Loading';

export default function ManageOrders({ myOrders, socket }) {
    const [loading, setLoading] = useState(false)
    const separators = [...new Set(myOrders.map(item => item.order_status !== 'received' ? item.order_custom_id : null).filter(el => el !== null))]
    useEffect(() => {
        setLoading(false)
    }, [myOrders])

    const updateOrderStatus = (e, order_id, status) => {
        e.preventDefault();
        setLoading(true)

        socket.emit('updateOrderStatus', {
            id: order_id,
            status
        })
    }
    return (
        <div className="merchant__manage__orders__main">
            <Loading loading={loading} />
            {!loading && <>
                <h3 className="text-center py-3">Manage Orders</h3>
                <div className="d-flex flex-wrap justify-content-around">

                    <div className="d-flex flex-wrap justify-content-center">

                        {separators.map(separator => <div key={separator}>

                            <div className="card  myorder__items m-2 ">
                                <div className="card-header bg-header">
                                    <h4 className="text-center">Order#<span className="text-danger"> {separator} </span> <span className="text-primary">{{ ...{ ...myOrders.find(order => order.order_custom_id === separator) }.User }.email}</span></h4>
                                </div>
                                <div className={`card-body  ${{ ...myOrders.find(order => order.order_custom_id === separator) }.order_status === 'paid' ? 'bg-paid' : 'bg-ready'}`}>
                                    <div className="d-flex flex-column">
                                        <div className="d-flex  justify-content-between myorder__items">
                                            <div>
                                                <h5></h5>
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
                                        <div>
                                            {{ ...myOrders.find(order => order.order_custom_id === separator) }.order_status === 'paid' &&
                                                <button className="btn btn-warning d-block w-100 my-2" onClick={e => updateOrderStatus(e, separator, "ready")}>Ready</button>}
                                            {{ ...myOrders.find(order => order.order_custom_id === separator) }.order_status === 'ready' &&
                                                <button className="btn btn-success d-block w-100 my-2" onClick={e => updateOrderStatus(e, separator, "received")}>Collected</button>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>)}

                    </div>
                </div>
            </>}
        </div>
    )
}



