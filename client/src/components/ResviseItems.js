import React, { useContext, useEffect } from 'react'
import API from '../utils/API';
import AppContext from '../utils/AppContext'
import './ReviseItems.css'

export default function ResviseItems() {
    const { state, dispatch } = useContext(AppContext)
    const basket = [];
    const order = {}
    let subTotal = {}
    for (let item in state.basket) {
        state.basket[item]["id"] = item
        basket.push(state.basket[item])

        if (order[state.basket[item].shopId]) {
            order[state.basket[item].shopId].push({ id: state.basket[item].id, qty: state.basket[item].qty })
            subTotal[state.basket[item].shopId] += state.basket[item].qty * state.basket[item].price
        } else {
            order[state.basket[item].shopId] = [{ id: state.basket[item].id, qty: state.basket[item].qty }]
            subTotal[state.basket[item].shopId] = state.basket[item].qty * state.basket[item].price
        }
    }
    console.log(order, subTotal);
    const handleSetOrders = (e) => {
        e.preventDefault();

        if (state.balance >= state.orderTotal) {
            //call api to store transaction , update user balance , create orders in the database
            API.processPayment({ orders: JSON.stringify(order), subTotal, total: state.orderTotal }, state.token)
                .then(res => {
                    console.log(res.data)
                    const socket = io();
                    socket.emit("userId", state.user_email)
                    socket.emit('newOrder', res.data)
                })
                .catch(err => console.log(err.response))

            dispatch({ type: 'notifier', display: { class: 'd-block', color: 'bg-success', text: 'YESSS' } })
            setTimeout(() => {
                dispatch({ type: 'notifier', display: { class: 'd-none', color: '', text: '' } })
            }, 2000);
        } else {
            dispatch({ type: 'notifier', display: { class: 'd-block', color: 'bg-danger', text: 'Your Balance is insufficient' } })
            setTimeout(() => {
                dispatch({ type: 'notifier', display: { class: 'd-none', color: '', text: '' } })
            }, 2000);
        }

    }
    return (
        <div>
            <h4 className="m-2">Basket Items</h4>
            {basket.map(item => <div key={item.id} className="card d-flex flex-row justify-content-between align-items-center p-2 m-1">
                <p className="revised-item-width p-0 m-0"><strong>{item.item_name}</strong> x {item.qty}</p>

                <p className="p-0 m-0"><strong>$</strong>{item.qty * item.price} </p>
                <button className="btn btn-danger" type="submit">Remove</button>

            </div>)}
            <p className="text-danger "> **You may go back to edit quantities if required</p>
            <button className="btn btn-success w-100" type="submit" onClick={e => handleSetOrders(e)}>Pay Now</button>
        </div>
    )
}


