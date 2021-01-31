import React, { useEffect, useState } from 'react'
import API from '../utils/API'

export default function AdminDashboard({ state }) {
    const [stats, setStats] = useState({})
    useEffect(() => {
        API.getAdminStats(state.token)
            .then(res => {
                let stats = res.data
                stats.spend = res.data.totalSpend[0].total
                let bestShop = res.data.bestShop[0]
                stats.bestShopName = bestShop.Shop.name
                stats.bestShopCount = bestShop.count
                stats.bestShopTotal = bestShop.total
                let highestSpender = res.data.highestSpender[0]
                stats.highestSpenderEmail = highestSpender.User.email
                stats.highestSpenderTotal = highestSpender.total
                console.log(stats);
                setStats(stats)
            })
            .catch(err => console.log(err))
    }, [state])
    return (
        <div className="user__dashboard__main text-center">
            <h3 className="py-3">Admin Dashboard</h3>
            {JSON.stringify(stats)}
            <div className="d-flex flex-wrap justify-content-around pt-4">
                <div className="d-flex  flex-wrap justify-content-around">
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Users</h3>
                        <h1 className="display-4  mt-4 text-danger">{stats.numberOfUsers}</h1>
                    </div>
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Merchants</h3>
                        <h3 className="mt-4 text-primary">{stats.numberOfMerchants}</h3>

                    </div>

                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Total Orders</h3>
                        <h1 className="display-4  mt-4 text-primary">{stats.numberOfOrders}</h1>
                    </div>
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Revenue</h3>
                        <h1 className="mt-4">$<span className="display-4 text-danger">{stats.spend}</span></h1>

                    </div>
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Best Selling Shop</h3>
                        <h1 className="mt-4">{stats.bestShopName}</h1>
                        <h1 className="mt-4">Orders#{stats.bestShopCount}</h1>
                        <h1 className="mt-4">Sales: $<span className="display-4 text-danger">{stats.bestShopTotal}</span></h1>

                    </div>
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Highest Spending User</h3>
                        <h1 className="mt-4">{stats.highestSpenderEmail}</h1>
                        <h1 className="mt-4">$<span className="display-4 text-danger">{stats.highestSpenderTotal}</span></h1>

                    </div>
                </div>
            </div>
        </div>
    )
}
