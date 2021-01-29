import React from 'react'

export default function UserDashboard({ orders, menu }) {
    let activeOrders = orders.filter(order => order.order_status !== 'received')
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
    let max = 0
    let best;
    for (let key in stats) {
        if (stats[key] > max) {
            max = stats[key]
            best = key
        }
    }


    return (
        <div className="user__dashboard__main text-center">
            <h3 className="py-3">User Dashboard</h3>

            <div className="d-flex flex-wrap justify-content-around pt-4">
                <div className="d-flex flex-grow-1 justify-content-around">
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Total Orders</h3>
                        <h1 className="display-4  mt-4 text-danger">{orders.length}</h1>
                    </div>
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Favourite</h3>
                        <h3 className="mt-4 text-primary">{{ ...menu.find(item => parseInt(best) === item.id) }.item_name}</h3>

                    </div>
                </div>
                <div className="d-flex  flex-grow-1 justify-content-around">
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Active Orders</h3>
                        <h1 className="display-4  mt-4 text-primary">{activeOrders.length}</h1>
                    </div>
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Total Spent</h3>
                        <h1 className="mt-4">$<span className="display-4 text-danger">{orders.reduce((b, a) => b + a.order_total, 0)}</span></h1>

                    </div>
                </div>
            </div>
        </div>
    )
}
