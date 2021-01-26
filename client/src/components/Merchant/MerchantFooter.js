import React, { useEffect, useState } from 'react'

import { FcShop } from 'react-icons/fc';
import { CgTimer } from 'react-icons/cg'
import { AiOutlineDollar } from 'react-icons/ai'
export default function MerchantFooter({ orders }) {
    const [shop, setShop] = useState({})
    const [activeOrders, setActiveOrders] = useState(0)
    useEffect(() => {
        for (let order of orders) {
            setShop(order.Shop)
            break;
        }
        setActiveOrders(orders.filter(order => order.order_status !== 'received').length)
    }, [orders])


    return (
        <div className="merchant__footer__main py-2">
            {/* <div className="d-flex justify-content-between align-items-center">
               
            </div> */}
            <div className="d-flex justify-content-around">
                <div className="d-flex flex-column align-items-center">
                    <FcShop className="FcShop" />
                    <p className="p-0 my-0 mx-2"><strong> {shop.name}</strong> </p>

                </div>
                <div className="d-flex flex-column align-items-center">
                    <CgTimer className="GrDocumentTime " />
                    <p className="p-0 my-0 mx-2">Active : <strong> {activeOrders}</strong> </p>
                </div>
                <div className="d-flex flex-column align-items-center">
                    <AiOutlineDollar className="AiOutlineDollar" />
                    <p className="p-0 my-0 mx-2"><strong> ${shop.balance}</strong> </p>
                </div>
            </div>
        </div>
    )
}


