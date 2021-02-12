import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import API from '../../utils/API';
export default function UserDashboard({ orders, state }) {
    const [stats, setStats] = useState({})
    const history = useHistory();
    useEffect(() => {
        if (state.token === '') {
            return
        }
        API.getUserStats(state.token)
            .then(res => {
                console.log(res.data);
                let temp = res.data;
                console.log(temp);
                setStats({
                    favourite_item: temp.favourite.Menu.item_name,
                    spent: temp.spent.spent,
                    totalOrders: temp.totalOrders
                })
            })
            .catch(err => console.log(err))
    }, [orders])

    return (
        <div className="user__dashboard__main text-center">




            <h3 className="py-3">User Dashboard</h3>

            <div className="d-flex flex-wrap justify-content-around pt-4">
                <div className="d-flex flex-grow-1 justify-content-around">
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Total Orders</h3>
                        <h1 className="display-4  mt-4 text-danger">{stats.totalOrders}</h1>
                    </div>
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Favourite</h3>
                        <h3 className="mt-4 text-primary">{stats.favourite_item}</h3>

                    </div>
                </div>
                <div className="d-flex  flex-grow-1 justify-content-around">
                    <div className="dashboard__item card animate__animated  animate__bounceIn cursor-pointer" onClick={() => history.push('/order-tracker')}>
                        <h3>Active Orders</h3>
                        <h1 className="display-4  mt-4 text-primary">{[...new Set(orders.map(order => order.order_custom_id))].length}</h1>
                    </div>
                    <div className="dashboard__item card animate__animated  animate__bounceIn">
                        <h3>Total Spent</h3>
                        <h1 className="mt-4">$<span className="display-4 text-danger">{stats.spent}</span></h1>

                    </div>
                </div>
            </div>
        </div>
    )
}
