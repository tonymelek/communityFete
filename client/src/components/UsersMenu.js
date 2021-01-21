import React, { useContext, useEffect, useState } from 'react'
import API from '../utils/API'
import AppContext from '../utils/AppContext'
import { Link, useHistory } from "react-router-dom";

export default function UsersMenu() {
    const { state, dispatch } = useContext(AppContext)
    const [menu, setMenu] = useState([])
    const history = useHistory();
    let expandShrink = ['d-none', 'd-block']
    const updatedBasket = state.basket;
    const categories = [... new Set(menu.map(item => item.Shop.category))]
    const expandIntSate = {}
    categories.forEach(category => expandIntSate[category] = 0)
    const [expand, setExpand] = useState(expandIntSate)

    useEffect(() => {
        API.getMenu_user()
            .then(res => {
                setMenu(res.data);
            })
            .catch(err => console.log(err.response))

    }, [state.refreshAPI])
    const addToBasket = (e, item_id, item_name, price, shopId) => {
        let qty = parseInt(e.target.value);
        if (qty <= 0) {
            e.target.value = 0
            qty = 0
            delete updatedBasket[item_id]
        } else {

            updatedBasket[item_id] = { qty, item_name, price, shopId }
        }
        dispatch({ type: 'updateBasket', basket: updatedBasket })
    }
    const handleTransfer = (e) => {
        e.preventDefault();
        history.push('/checkout')
    }
    return (
        <div>
            {categories.map(category => <div key={category}>

                <div className={`card my-2 p-2   text-primary cursor-pointer`} onClick={() => setExpand({ ...expand, [category]: !expand[category] })}><h5>{category}</h5></div>
                {menu.filter(items => items.Shop.category === category).map(item => <div key={item.id} className={`card my-2 p-2 d-flex flex-row flex-wap justify-content-between animate__animated   animate__zoomIn ${expandShrink[expand[category] ? 1 : 0]}`}>
                    <div>
                        <p className="my-1"><strong>{item.item_name}</strong>-{item.serve}</p>
                        <p className="my-1">{item.item_desc}</p>
                        <p className="my-2">({item.unit}) ${item.price}</p>
                        Qty<input type="number" onChange={e => addToBasket(e, item.id, item.item_name, item.price, item.ShopId)} className="form-control w-50" />
                    </div>
                    <div>
                        <img src={item.item_pic} width="100" alt={item.item_name} />
                    </div>
                </div>)}
            </div>)}
            <button type="submit" onClick={e => handleTransfer(e)} className="btn btn-primary w-100 mb-3">Check out</button>
        </div>
    )
}


