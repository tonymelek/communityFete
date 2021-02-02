import React, { useEffect, useState } from 'react'

import { FcShop } from 'react-icons/fc';
import { CgTimer } from 'react-icons/cg'
import { AiOutlineDollar } from 'react-icons/ai'
export default function MerchantFooter({ orders }) {
    let shop = ''
    const stats = {}
    const formatted = {}
    let active = 0
    let balance = 0

    for (let order of orders) {
        shop = order.Shop.name
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
            balance += order.order_total
            if (order.order_status !== 'received') {
                active++

            }
        }
    }





    return (
        <div className="merchant__footer__main py-2">
            {/* <div className="d-flex justify-content-between align-items-center">
               
            </div> */}
            <div className="d-flex justify-content-around">
                <div className="d-flex flex-column align-items-center">
                    <FcShop className="FcShop" />
                    <p className="p-0 my-0 mx-2"><strong> {shop}</strong> </p>

                </div>
                <div className="d-flex flex-column align-items-center">
                    <CgTimer className="GrDocumentTime " />
                    <p className="p-0 my-0 mx-2">Active : <strong> {active}</strong> </p>
                </div>
                <div className="d-flex flex-column align-items-center">
                    <AiOutlineDollar className="AiOutlineDollar" />
                    <p className="p-0 my-0 mx-2"><strong> ${balance}</strong> </p>
                </div>
            </div>
        </div>
    )
}


