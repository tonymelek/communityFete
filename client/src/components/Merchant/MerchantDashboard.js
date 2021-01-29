import React from 'react'
import './MerchantDashboard.css'
export default function MerchantDashboard({ orders, menu }) {
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

    console.log(menu);
    return (
        <div className="merchant__dasboard__main text-center">
            <h3 className="text-center py-3">Merchant Dashboard</h3>

            <div className="d-flex flex-wrap justify-content-around pt-4">
                <div className="d-flex flex-grow-1 justify-content-around">
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Total Orders</h3>
                        <h1 className="display-1 mt-4 text-danger">{orders.length}</h1>
                    </div>
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Best Seller</h3>
                        <h2 className="mt-3">{{ ...menu.find(item => parseInt(best) === item.id) }.item_name}</h2>
                        <h5>Sold: {max}</h5>

                    </div>
                </div>
                <div className="d-flex  flex-grow-1 justify-content-around">
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Menu Items</h3>
                        <h1 className="display-1 mt-4 text-primary">{menu.filter(item => item.availability).length}</h1>
                    </div>
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Merchants</h3>
                        {/* Needs API end point */}
                    </div>
                </div>
            </div>
        </div>
    )
}
