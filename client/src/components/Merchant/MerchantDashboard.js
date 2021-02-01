import React, { useEffect, useState } from 'react'
import API from '../../utils/API';
import './MerchantDashboard.css'
export default function MerchantDashboard({ orders, menu, state }) {
    const [merchants, setMerchants] = useState(0)

    const separators = [...new Set(orders.map(item => item.order_custom_id))]

    let stats = {}

    for (let order of orders) {
        if (stats[order.Menu.item_name]) {
            stats[order.Menu.item_name] += order.item_qty
        } else {
            stats[order.Menu.item_name] = order.item_qty
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
    useEffect(() => {
        if (state.user_email === "") {
            return
        }
        API.getMerchantsPerShop(state.user_email)
            .then(res => {
                setMerchants(res.data.merchantsCount)
            })
            .catch(err => console.log(err))
    }, [state])


    return (
        <div className="merchant__dasboard__main text-center">
            <h3 className="text-center py-3">Merchant Dashboard</h3>
            <div className="d-flex flex-wrap justify-content-around pt-4">
                <div className="d-flex flex-grow-1 justify-content-around">
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Total Orders</h3>
                        <h1 className="display-1 mt-4 text-danger">{separators.length}</h1>
                    </div>
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Best Seller</h3>
                        <h2 className="mt-3 text-primary">{best}</h2>
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
                        <h1 className="display-1 mt-4 text-danger">{merchants}</h1>

                    </div>
                </div>
            </div>
        </div>
    )
}
