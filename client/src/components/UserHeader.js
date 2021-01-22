import React, { useContext, useEffect, useState } from 'react'
import API from '../utils/API'
import AppContext from '../utils/AppContext'

export default function UserHeader() {
    const { state, dispatch } = useContext(AppContext)
    const [menu, setMenu] = useState([])
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
        <div className="sticky-top bg-dark text-light p-2 text-center">
            {/* {JSON.stringify(state)} */}
            <p>Hi {state.user_email}</p>
            <p>Balance :${state.balance}</p>
            <p>Items : {Object.keys(state.basket).length}</p>
            <p >Total : ${total} </p>
        </div>
    )
}