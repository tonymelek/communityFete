import React, { useEffect, useState } from 'react'
import socketIOClient from "socket.io-client";

export default function ManageOrders({ values }) {


    const { state, oldOrders, setOldOrders, menu, setMenu } = values



    const updateOrderStatus = (e, order_id, status) => {
        e.preventDefault();
        const socket = socketIOClient();
        socket.emit('updateOrderStatus', {
            id: order_id,
            status
        })


    }
    return (
        <div className="merchant__manage__orders__main">
            <h3 className="text-center py-3">Manage Orders</h3>
            <div className="d-flex flex-wrap justify-content-around">
                {oldOrders.filter(order => order.order_status !== "received").length === 0 ? <h2 className="text-danger">No active Orders</h2> : <>
                    {
                        oldOrders.filter(order => order.order_status !== "received").map(item => <div key={item.id} className="card m-3  merchant__orders my-2 ">
                            <div className="card-header">
                                <h5 className="text-center"><span className="text-primary">Order # {item.id} </span>- {item.User.email}</h5>
                            </div>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">

                                    <div>{JSON.parse(item.order_items)
                                        .map((orderItem, index) => <div key={`orderItem-${index}`}>
                                            <p>{menu.filter(menuItem => menuItem.id == orderItem.id)[0].item_name}x{orderItem.qty}</p>
                                        </div>)
                                    }
                                    </div>
                                    <div>
                                        <li className={`${item.order_status === 'paid' ? 'text-danger' : 'text-success'} merchant__order__status`}><strong>{item.order_status}</strong></li>
                                    </div>
                                </div>
                                {item.order_status === 'paid' &&
                                    <button className="btn btn-warning d-block w-100 my-2" onClick={e => updateOrderStatus(e, item.id, "ready")}>Ready</button>}
                                {item.order_status === 'ready' &&
                                    <button className="btn btn-success d-block w-100 my-2" onClick={e => updateOrderStatus(e, item.id, "received")}>Collected</button>}

                            </div>
                        </div>)
                    } </>
                }

            </div>
        </div>
    )
}



