import React, { useEffect, useState } from 'react'
import API from '../../utils/API'

export default function AdminDashboard({ state }) {
    const [stats, setStats] = useState({})
    useEffect(() => {
        if (state.token === "") {
            return
        }
        API.getAdminStats(state.token)
            .then(res => {
                let stats = res.data
                stats.spend = res.data.totalSpend[0].total
                if (res.data.highestSpender.length === 1) {
                    let highestSpender = res.data.highestSpender[0]
                    stats.highestSpenderEmail = highestSpender.User.email
                    stats.highestSpenderTotal = highestSpender.total
                } else {
                    stats.highestSpenderEmail = 'no purchases yet'
                    stats.highestSpenderTotal = 0
                }
                const orders = stats.orders
                const unique = {}
                const custom_ids = [...new Set(orders.map(item => item.order_custom_id))]
                for (let id of custom_ids) {
                    let order = orders.find(order => order.order_custom_id === id)
                    if (unique[order.Shop.name]) {
                        unique[order.Shop.name].total += order.order_total
                        unique[order.Shop.name].orders++
                    } else {
                        unique[order.Shop.name] = { total: order.order_total, orders: 1 }
                    }
                }
                console.log(unique);
                let max = 0
                let best;
                let highest = 0
                for (let key in unique) {
                    if (unique[key].total > max) {
                        max = unique[key].total
                        best = key
                        highest = unique[key].orders
                    }
                }
                stats.bestShop = unique[best]
                stats.bestShopName = best
                setStats(stats)
            })
            .catch(err => console.log(err))
    }, [state])
    return (
        <div className="admin__dashboard__main text-center">
            <h3 className="py-3">Admin Dashboard</h3>
            <div className="d-flex flex-wrap justify-content-around pt-4">
                
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Users</h3>
                        <h1 className="display-4  mt-4 text-danger">{stats.numberOfUsers}</h1>
                    </div>
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Merchants</h3>
                        <h1 className="mt-4 text-primary display-4">{stats.numberOfMerchants}</h1>

                    </div>

                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Total Orders</h3>
                        <h1 className="display-4  mt-4 text-primary">{stats.numberOfOrders}</h1>
                    </div>
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Revenue</h3>
                        <h1 className="mt-4">$<span className="display-4 text-danger">{stats.spend > 0 ? stats.spend : 0}</span></h1>

                    </div>
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Best Selling Shop</h3>
                        <h2 className="text-danger mt-2">{stats.bestShopName}</h2>
                        <h3 >Orders# {{ ...stats.bestShop }.orders}</h3>
                        <h3 >Sales: $<span className="text-danger">{{ ...stats.bestShop }.total}</span></h3>

                    </div>
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Highest Spending User</h3>
                        <h2 className="mt-4">{stats.highestSpenderEmail}</h2>
                        <h3>Spent : $<span className="text-danger">{stats.highestSpenderTotal}</span></h3>

                    </div>
              
            </div>
        </div>
    )
}
