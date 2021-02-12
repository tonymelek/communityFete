import React, { useEffect, useState } from 'react'
import API from '../../utils/API';
import Loading from '../common/Loading';
import './MerchantDashboard.css'
export default function MerchantDashboard({ orders, menu, state }) {

    const [stats, setStats] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (state.user_email === "") {
            return
        }
        API.getMerchantStats(state.user_email)
            .then(res => {
                console.log(res.data);
                setStats({
                    total: res.data.totalOrders,
                    bestSeller: res.data.bestSeller[0].Menu.item_name,
                    bestCount: res.data.bestSeller[0].item_count,
                    merchantsCount: res.data.merchantsCount
                })
                setLoading(false);

            })
            .catch(err => console.log(err))
    }, [orders])


    return (
        <div className="merchant__dasboard__main text-center">
            <Loading loading={loading} />
            {!loading && <>
                <h3 className="text-center py-3">Merchant Dashboard</h3>
                <div className="d-flex flex-wrap justify-content-around pt-4">
                    <div className="d-flex flex-grow-1 justify-content-around">
                        <div className="dashboard__item card animate__animated  animate__bounceIn">
                            <h3>Total Orders</h3>
                            <h1 className="display-1 mt-4 text-danger">{stats.total}</h1>
                        </div>
                        <div className="dashboard__item card animate__animated  animate__bounceIn">
                            <h3>Best Seller</h3>
                            <h2 className="mt-3 text-primary">{stats.bestSeller}</h2>
                            <h5>Sold: {stats.bestCount}</h5>

                        </div>
                    </div>
                    <div className="d-flex  flex-grow-1 justify-content-around">
                        <div className="dashboard__item card animate__animated  animate__bounceIn">
                            <h3>Menu Items</h3>
                            <h1 className="display-1 mt-4 text-primary">{menu.filter(item => item.availability).length}</h1>
                        </div>
                        <div className="dashboard__item card animate__animated  animate__bounceIn">
                            <h3>Merchants</h3>
                            <h1 className="display-1 mt-4 text-danger">{stats.merchantsCount}</h1>

                        </div>
                    </div>
                </div>
            </>}
        </div>
    )
}
