import React from 'react'
import './MerchantDashboard.css'
export default function MerchantDashboard({ orders }) {
    console.log(orders);
    let formatted_orders = orders.map(order => {
        return JSON.parse(order.order_items)
    }).flat();
    let stats = {}
    for (let order of formatted_orders) {
        if (stats[order.id]) {
            stats[order.id] += order.qty
        } else {
            stats[order.id] = order.qty
        }
    }
    console.log(stats);
    let max = 0
    let best;
    for (let key in stats) {
        if (stats[key] > max) {
            max = stats[key]
            best = key
        }
    }
    console.log(best, max);

    return (
        <div className="text-center">

            <h2 className="my-4  text-center"> Merchant Dashboard</h2>
            <div className="d-flex flex-wrap justify-content-around pt-4">
                <div className="d-flex flex-grow-1 justify-content-around">
                    <div className="dashboard__item ">
                        <h3>Total Orders</h3>
                        <h1>{orders.length}</h1>
                    </div>
                    <div className="dashboard__item">
                        <h3>Best Seller</h3>
                        <h1>{best} -{max}</h1>
                    </div>
                </div>
                <div className="d-flex  flex-grow-1 justify-content-around">
                    <div className="dashboard__item"></div>
                    <div className="dashboard__item"></div>
                </div>
            </div>
        </div>
    )
}
