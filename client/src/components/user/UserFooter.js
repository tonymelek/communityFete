import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../utils/AppContext'
import { FaShoppingBasket } from 'react-icons/fa';
import { AiOutlineDollar } from 'react-icons/ai'
import { FcMoneyTransfer } from 'react-icons/fc'

export default function UserFooter() {
    const { state, dispatch } = useContext(AppContext)
    const basket = state.basket;
    const [total, setTotal] = useState(0)

    useEffect(() => {
        let tempTotal = 0
        for (let item in basket) {
            tempTotal += basket[item].qty * basket[item].price
        }
        setTotal(tempTotal)
    }, [state])
    useEffect(() => {
        dispatch({ type: 'update_orderTotal', orderTotal: total })
    }, [total])


    return (

        <div className="user__header2__main py-2">
            <div className="d-flex justify-content-around">
                <div className="d-flex flex-column align-items-center">
                    <FaShoppingBasket className="AiOutlineDollar" />
                    <p className="p-0 my-0 mx-2"><strong>{Object.keys(state.basket).length} </strong> </p>

                </div>
                <div className="d-flex flex-column align-items-center">
                    <FcMoneyTransfer className="AiOutlineDollar " />
                    <p className="p-0 my-0 mx-2">Total:<strong>${total} </strong> </p>
                </div>
                <div className="d-flex flex-column align-items-center">
                    <AiOutlineDollar className="AiOutlineDollar" />
                    <p className="p-0 my-0 mx-2"><strong> $</strong> {state.balance}</p>
                </div>
            </div>
        </div>
    )
}