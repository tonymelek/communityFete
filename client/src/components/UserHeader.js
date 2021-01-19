import React, { useContext, useEffect, useState } from 'react'
import API from '../utils/API'
import AppContext from '../utils/AppContext'

export default function UserHeader() {
    const { state, dispatch } = useContext(AppContext)
    const [menu, setMenu] = useState([])
    const basket = state.basket;
    useEffect(() => {
        let tempTotal = 0
        for (let item in basket) {
            tempTotal += basket[item].qty * basket[item].price
        }
        dispatch({ type: 'update_orderTotal', orderTotal: tempTotal })
    }, [state])
    return (
        <div className="sticky-top bg-dark text-light p-2 text-center">
            <p>Hi {state.user_email}</p>
            <p>Balance :${state.balance}</p>
            <p>Items : {Object.keys(state.basket).length}</p>
            <p>Total : ${state.orderTotal} </p>
        </div>
    )
}