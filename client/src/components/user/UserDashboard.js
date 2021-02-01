import React from 'react'

export default function UserDashboard({ orders }) {

    const separators = [...new Set(orders.map(item => item.order_custom_id))]

    const stats = {}
    const formatted = {}
    let active = 0
    let spent = 0

    for (let order of orders) {
        if (stats[order.Menu.item_name]) {
            stats[order.Menu.item_name] += order.item_qty
        } else {
            stats[order.Menu.item_name] = order.item_qty
        }
        if (formatted[order.order_custom_id]) {
            formatted[order.order_custom_id]['items'].push(order)
        }
        else {
            formatted[order.order_custom_id] = {}
            formatted[order.order_custom_id]['items'] = [order]
            formatted[order.order_custom_id]['total'] = order.order_total
            if (order.order_status !== 'received') {
                active++
                spent += order.order_total
            }
        }
    }
    console.log(formatted, active);

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
                        <h1 className="display-4  mt-4 text-danger">{Object.keys(formatted).length}</h1>
                    </div>
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Favourite</h3>
                        <h3 className="mt-4 text-primary">{best}</h3>

                    </div>
                </div>
                <div className="d-flex  flex-grow-1 justify-content-around">
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Active Orders</h3>
                        <h1 className="display-4  mt-4 text-primary">{active}</h1>
                    </div>
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Total Spent</h3>
                        <h1 className="mt-4">$<span className="display-4 text-danger">{spent}</span></h1>

                    </div>
                </div>
            </div>
        </div>
    )
}
