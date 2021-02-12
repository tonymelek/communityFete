import React, { useEffect, useState } from 'react'

import { FcShop } from 'react-icons/fc';
import { CgTimer } from 'react-icons/cg'
import { AiOutlineDollar } from 'react-icons/ai'
import API from '../../utils/API';
export default function MerchantFooter({ orders, state }) {
    const [footer, setFooter] = useState({})
    useEffect(() => {
        if (state.token === '') {
            return
        }
        API.getMerchantFooter(state.token)
            .then(res => setFooter({
                name: res.data.name
                , balance: res.data.balance
            }))
        console.log(orders);

    }, [orders])



    return (
        <div className="merchant__footer__main py-2">
            {/* <div className="d-flex justify-content-between align-items-center">
               
            </div> */}
            <div className="d-flex justify-content-around">
                <div className="d-flex flex-column align-items-center">
                    <FcShop className="FcShop" />
                    <p className="p-0 my-0 mx-2"><strong>{footer.name}</strong> </p>

                </div>
                <div className="d-flex flex-column align-items-center">
                    <CgTimer className="GrDocumentTime " />
                    <p className="p-0 my-0 mx-2">Active : <strong> {[...new Set(orders.map(order => order.order_custom_id))].length}</strong> </p>
                </div>
                <div className="d-flex flex-column align-items-center">
                    <AiOutlineDollar className="AiOutlineDollar" />
                    <p className="p-0 my-0 mx-2"><strong> ${footer.balance}</strong> </p>
                </div>
            </div>
        </div>
    )
}


