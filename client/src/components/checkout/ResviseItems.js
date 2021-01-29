import React, { useEffect, useState } from 'react'
import API from '../../utils/API';
import './ReviseItems.css'


export default function ResviseItems({ props }) {
    const { state, dispatch, history, socketIOClient } = props
    const [basket, setBasket] = useState([]);
    const [order, setOrder] = useState({});
    const [subTotal, setSubTotal] = useState({});
    const t_basket = [];
    const t_order = {}
    const t_subTotal = {}
    useEffect(() => {
        for (let item in state.basket) {
            state.basket[item]["id"] = item
            t_basket.push(state.basket[item])
            let tempItem = { ...state.basket[item] }
            if (t_order[tempItem.ShopId]) {
                t_order[tempItem.ShopId].push({ id: tempItem.id, qty: tempItem.qty })
                t_subTotal[tempItem.ShopId] += tempItem.qty * tempItem.price
            } else {
                t_order[tempItem.ShopId] = [{ id: tempItem.id, qty: tempItem.qty }]
                t_subTotal[tempItem.ShopId] = tempItem.qty * tempItem.price
            }
        }
        setBasket(t_basket)
        setOrder(t_order)
        setSubTotal(t_subTotal)
    }, [state])




    const handleSetOrders = (e) => {
        e.preventDefault();
        if (state.orderTotal === 0) {
            dispatch({ type: 'notifier', display: { class: 'd-block', color: 'bg-danger', text: 'Total should not be zero, you will be redirected to main page' } })
            setTimeout(() => {
                dispatch({ type: 'notifier', display: { class: 'd-none', color: '', text: '' } })
            }, 2000);
            return history.replace('/user')
        }
        const socket = socketIOClient()
        if (state.balance >= state.orderTotal) {
            //call api to store transaction , update user balance , create orders in the database
            API.processPayment({ orders: JSON.stringify(order), subTotal, total: state.orderTotal }, state.token)
                .then(res => {
                    console.log(res.data)
                    socket.emit('newOrder', res.data)
                    socket.disconnect();
                })
                .catch(err => console.log(err.response))

            dispatch({ type: 'notifier', display: { class: 'd-block', color: 'bg-success', text: 'Order Processed Successfully' } })
            setTimeout(() => {
                dispatch({ type: 'notifier', display: { class: 'd-none', color: '', text: '' } })
                history.replace('/order-tracker')
            }, 2000);
        } else {
            dispatch({ type: 'notifier', display: { class: 'd-block', color: 'bg-danger', text: 'Your Balance is insufficient' } })
            setTimeout(() => {
                dispatch({ type: 'notifier', display: { class: 'd-none', color: '', text: '' } })
            }, 2000);
        }

    }
    const handleDelete = (e, id) => {
        e.preventDefault();
        let temp = state.basket;
        delete temp[id]
        dispatch({ type: 'updateBasket', basket: temp })

    }
    return (
        <div className="revise__items__main d-flex flex-column justify-content-between">
            <div className="resvise__items__list">
                <h2>Items in Basket</h2>
                {basket.map(item => <div key={item.id} className="card d-flex flex-row justify-content-between align-items-center p-2 m-1">
                    <p className="revised-item-width p-0 m-0"><strong>{item.item_name}</strong> x {item.qty}</p>

                    <p className="p-0 m-0"><strong>$</strong>{item.qty * item.price} </p>
                    <button className="btn btn-danger" onClick={(e) => handleDelete(e, item.id)} type="submit">Remove</button>

                </div>)}

            </div>
            <div className="checkout__button">
                <p className="text-danger "> **You may go back to edit quantities if required</p>
                <button className="btn btn-success w-100" type="submit" onClick={e => handleSetOrders(e)}>Pay Now &nbsp;&nbsp;&nbsp;&nbsp;${state.orderTotal}</button>
            </div>
        </div>
    )
}


