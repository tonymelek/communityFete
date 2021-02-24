import React, { useContext, useEffect, useState } from 'react'
import API from '../utils/API'
import AppContext from '../utils/AppContext'

import Loading from './common/Loading'
export default function MyOrders({ myOrders, loading, separators }) {

    return (
        <>
            <Loading loading={loading} />
            <div>

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


